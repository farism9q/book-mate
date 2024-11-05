import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { object, z } from "zod";
import { HTTPException } from "hono/http-exception";
import { Message } from "@prisma/client";
import { db } from "@/lib/db";
import { getEmbedding } from "@/lib/openai";
import { conversationIndex } from "@/lib/pinecone";

const MESSAGES_BATCH_SIZE = 10;

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      object({
        sort: z.enum(["asc", "desc"]).optional().default("desc"),
      })
    ),

    async c => {
      const auth = getAuth(c);

      try {
        if (!auth?.userId) {
          throw new HTTPException(401, {
            res: c.json({ error: "Unauthorized" }, 401),
          });
        }

        const { sort } = c.req.valid("query");

        const conversations = await db.conversation.findMany({
          where: {
            userId: auth.userId,
            deleted: false,
          },
          include: {
            messages: true,
          },
          orderBy: {
            updatedAt: sort,
          },
        });

        return c.json({ conversations });
      } catch (err) {
        throw new HTTPException(500, {
          res: c.json({ error: "Internal Server Error" }, 500),
        });
      }
    }
  )
  .get("/:conversationId", clerkMiddleware(), async c => {
    const auth = getAuth(c);

    if (!auth || !auth.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized" }, 401),
      });
    }

    const conversationId = c.req.param("conversationId");

    let conversation = await db.conversation.findFirst({
      where: {
        id: conversationId,
        deleted: false,
      },
      include: {
        messages: {
          include: {
            files: true,
          },
        },
      },
    });

    if (!conversation) {
      throw new HTTPException(400, {
        res: c.json({ error: "Conversation not found" }, 400),
      });
    }

    return c.json({ conversation }, 200);
  })
  .get(
    "/:conversationId/messages",
    clerkMiddleware(),
    zValidator("query", object({ cursor: z.string().optional() })),
    async c => {
      const auth = getAuth(c);

      if (!auth || !auth.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      const { userId } = auth;

      const conversationId = c.req.param("conversationId");

      const { cursor } = c.req.valid("query");

      let messages: Message[];

      const conversation = await db.conversation.findFirst({
        where: {
          id: conversationId,
          userId,
          deleted: false,
        },
      });

      // There might be no conversationId if the user hasn't started a conversation yet
      if (!conversation) {
        return c.json({ messages: [], nextCursor: null });
      }

      if (cursor) {
        messages = await db.message.findMany({
          where: {
            conversationId,
          },
          take: MESSAGES_BATCH_SIZE,
          skip: 1,
          cursor: {
            id: cursor,
          },
          orderBy: {
            createdAt: "desc",
          },
          include: {
            files: true,
          },
        });
      } else {
        messages = await db.message.findMany({
          where: {
            conversationId,
          },
          take: MESSAGES_BATCH_SIZE,
          orderBy: {
            createdAt: "desc",
          },
          include: {
            files: true,
          },
        });
      }

      let nextCursor = null;

      if (messages.length === MESSAGES_BATCH_SIZE) {
        nextCursor = messages[messages.length - 1].id;
      }

      return c.json({ messages, nextCursor });
    }
  )
  .get("/chat-limit/:conversationId", clerkMiddleware(), async c => {
    const auth = getAuth(c);

    if (!auth || !auth.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized" }, 401),
      });
    }

    const { conversationId } = c.req.param();

    const bookChatCounts = await db.message.findMany({
      where: {
        conversationId,
      },
      take: 5,
    });

    return c.json({ bookChatCounts: bookChatCounts.length });
  })
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      object({
        bookId: z.string(),
      })
    ),
    async c => {
      const auth = getAuth(c);

      if (!auth || !auth.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      const { userId } = auth;
      const { bookId } = c.req.valid("json");

      let conversation = await db.conversation.findFirst({
        where: {
          bookId,
          userId,
          deleted: false,
        },
        include: {
          messages: true,
        },
      });

      // If the conversation doesn't exist, create one
      if (conversation) {
        return c.json({ conversation }, 200);
      }

      const newConversation = await db.conversation.create({
        data: {
          bookId,
          userId,
        },
      });
      return c.json({ conversation: newConversation }, 201);
    }
  )
  .post(
    "/:conversationId",
    clerkMiddleware(),
    zValidator(
      "json",
      object({
        question: z.string(),
        text: z.string(),
        files: z.array(z.string()).optional(),
      })
    ),
    async c => {
      const auth = getAuth(c);

      if (!auth || !auth.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      const { userId } = auth;
      const { question, text, files } = c.req.valid("json");
      const { conversationId } = c.req.param();

      let createdMessageId: string | undefined;

      try {
        await db.$transaction(async tx => {
          const updatedConversation = await tx.conversation.update({
            where: { id: conversationId },
            data: {
              updatedAt: new Date(),
              messages: {
                create: {
                  userQuestion: question,
                  chatGPTResponse: text,
                  files:
                    files && files.length > 0
                      ? {
                          create: files.map(url => ({
                            url,
                            type: url.includes(".pdf") ? "FILE" : "IMAGE",
                          })),
                        }
                      : undefined,
                },
              },
            },
            include: {
              messages: {
                include: { files: true },
                orderBy: { createdAt: "desc" },
                take: 1,
              },
            },
          });

          createdMessageId = updatedConversation.messages[0].id;
        });

        // After the transaction, create embeddings and store them in Pinecone
        const questionEmbeddings = await getEmbedding(
          `Question: ${question}\nResponse: ${text}`
        );

        if (!questionEmbeddings) {
          throw new Error("Failed to generate embeddings");
        }

        if (createdMessageId) {
          await conversationIndex.upsert([
            {
              id: createdMessageId,
              values: questionEmbeddings,
              metadata: {
                userId,
                conversationId,
              },
            },
          ]);
        }

        return c.json({ success: true }, 201);
      } catch (error) {
        throw new HTTPException(500, {
          res: c.json({ error: "Internal Server Error" }, 500),
        });
      }
    }
  );

export default app;
