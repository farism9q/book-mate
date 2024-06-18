import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { object, z } from "zod";
import { HTTPException } from "hono/http-exception";
import { FavoriteBookStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { ErrorType } from "@/constants";
import { userHasFreeLimit } from "@/lib/user-limit";
import { increaseUserLimit } from "@/features/user-limit/actions";
import { client } from "@/lib/hono";
import { checkSubscription } from "@/lib/user-subscription";

const app = new Hono()
  .get(
    "/",
    clerkMiddleware(),
    zValidator(
      "query",
      object({
        filter: z
          .enum([
            "all",
            FavoriteBookStatus.FINISHED,
            FavoriteBookStatus.READING,
            FavoriteBookStatus.WILL_READ,
          ])
          .optional(),
        sort: z.string().optional(),
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

        const { filter, sort } = c.req.valid("query");

        const retrieveFilter =
          filter === "all" || !filter
            ? undefined
            : (filter.toUpperCase() as FavoriteBookStatus);
        const retreiveSort = sort || "desc";

        const favoriteBooks = await db.favorite.findMany({
          where: {
            userId: auth.userId,
            status: retrieveFilter,
          },

          orderBy: {
            createdAt: retreiveSort as "asc" | "desc",
          },
        });

        return c.json({ favoriteBooks });
      } catch (err) {
        throw new HTTPException(500, {
          res: c.json({ error: "Internal Server Error" }, 500),
        });
      }
    }
  )
  .get("/count", clerkMiddleware(), async c => {
    const auth = getAuth(c);

    if (!auth || !auth.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized" }, 401),
      });
    }

    const { userId } = auth;

    const favoriteBooks = await db.favorite.findMany({
      where: {
        userId,
      },
      take: 5,
    });

    return c.json({
      count: favoriteBooks.length === 0 ? 0 : favoriteBooks.length,
    });
  })
  .post("/:bookId", clerkMiddleware(), async c => {
    const auth = getAuth(c);

    const { bookId } = c.req.param();

    if (!auth || !auth.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized" }, 401),
      });
    }

    const { userId } = auth;

    const isAlreadyFav = await db.favorite.findFirst({
      where: {
        userId,
        bookId,
      },
    });

    if (isAlreadyFav) {
      return c.json(
        {
          message: "The book is already in your favorite book list",
          type: ErrorType.ALREADY_FAV,
        },
        403
      );
    }

    const isFreeLimit = await userHasFreeLimit({ type: "addFavBook" });
    const isSubscribed = await checkSubscription();

    if (!isFreeLimit && !isSubscribed) {
      return c.json(
        {
          message: "Upgrade your plan to add more books",
          type: ErrorType.UPGRADE_PLAN,
        },
        403
      );
    }

    const updatedUser = await db.user.update({
      where: {
        userClerkId: userId,
      },
      data: {
        favorites: {
          create: {
            bookId,
          },
        },
      },
    });

    if (!isSubscribed) {
      await increaseUserLimit();
    }

    return c.json({ updatedUser }, 201);
  })
  .patch(
    "/:favBookId",
    clerkMiddleware(),
    zValidator(
      "json",
      object({
        status: z.enum([
          FavoriteBookStatus.FINISHED,
          FavoriteBookStatus.READING,
          FavoriteBookStatus.WILL_READ,
        ]),
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
      const { status } = c.req.valid("json");
      const { favBookId } = c.req.param();

      const updatedFavBook = await db.favorite.update({
        where: {
          userId,
          id: favBookId,
        },
        data: {
          status,
        },
      });

      return c.json({ updatedFavBook });
    }
  )
  .delete(
    "/:favBookId",
    clerkMiddleware(),
    zValidator("json", object({ bookId: z.string() })),
    async c => {
      const auth = getAuth(c);

      if (!auth || !auth.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      const { bookId } = c.req.valid("json");
      const { favBookId } = c.req.param();
      const { userId } = auth;

      const conversation = await db.conversation.findFirst({
        where: {
          bookId,
          userId,
        },
      });

      // It might the user has not started a conversation with the book yet.
      // So, we need to check if the conversation exists or not.
      if (conversation) {
        await db.conversation.update({
          where: {
            id: conversation.id,
            userId,
            bookId,
          },
          data: {
            deleted: true,
          },
        });
      }

      await db.favorite.delete({
        where: {
          id: favBookId,
          userId,
          bookId,
        },
      });

      return c.json({
        success: true,
        message: "Favorite book deleted successfully",
      });
    }
  );

export default app;
