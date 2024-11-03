import { db } from "@/lib/db";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";
import { recoverFromNotFound } from "./utils";

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      z.object({
        isArchive: z.string().optional(),
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

      const { isArchive } = c.req.valid("query");

      const documents = await db.document.findMany({
        where: {
          userId,
          isArchived: isArchive === "true" ? true : false,
        },
      });

      return c.json({ documents }, 200);
    }
  )
  .get("/:documentId", clerkMiddleware(), async c => {
    const auth = getAuth(c);

    if (!auth || !auth.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized" }, 401),
      });
    }

    const { userId } = auth;
    const { documentId } = c.req.param();

    const document = await recoverFromNotFound(
      db.document.findFirst({
        where: {
          id: documentId,
          userId,
          isArchived: false,
        },
      })
    );

    if (!document) {
      throw new HTTPException(404, {
        res: c.json({ error: "Document not found" }, 404),
      });
    }

    return c.json({ document }, 200);
  })
  .post("/", clerkMiddleware(), async c => {
    const auth = getAuth(c);

    if (!auth || !auth.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized" }, 401),
      });
    }

    const { userId } = auth;

    const document = await db.document.create({
      data: {
        userId,
        title: "New Document",
      },
    });

    return c.json({ document }, 200);
  })
  .patch(
    "/:documentId",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        title: z.string().optional(),
        content: z.string().optional(),
        coverImage: z.string().optional(),
        isPublic: z.boolean().optional(),
        isArchived: z.boolean().optional(),
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
      const { documentId } = c.req.param();
      const fieldsToUpdate = c.req.valid("json");

      const document = recoverFromNotFound(
        db.document.update({
          where: { id: documentId, userId },
          data: {
            ...fieldsToUpdate,
          },
        })
      );

      if (!document) {
        throw new HTTPException(404, {
          res: c.json({ error: "Document not found" }, 404),
        });
      }

      return c.json({ updatedDocument: document }, 200);
    }
  )
  .delete("/:documentId", clerkMiddleware(), async c => {
    const auth = getAuth(c);

    if (!auth || !auth.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized" }, 401),
      });
    }

    const { userId } = auth;

    const { documentId } = c.req.param();

    const document = recoverFromNotFound(
      db.document.delete({
        where: {
          id: documentId,
          userId,
        },
      })
    );

    if (!document) {
      throw new HTTPException(404, {
        res: c.json({ error: "Document not found" }, 404),
      });
    }

    return c.json({ deletedDocument: document }, 200);
  });

export default app;
