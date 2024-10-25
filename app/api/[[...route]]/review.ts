import { db } from "@/lib/db";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

// Using cursor-based pagination is suitable for this use case because we are fetching reviews as the users scroll down the page.

const app = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        userId: z.string().optional(),
        cursor: z.string().optional(),
        batchSize: z.string().optional(),
      })
    ),
    clerkMiddleware(),
    async c => {
      const auth = getAuth(c);

      if (!auth || !auth.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      const { userId: userIdParam, cursor, batchSize } = c.req.valid("query");

      let userId: string;
      if (userIdParam !== undefined) {
        userId = userIdParam;
      } else {
        userId = auth.userId;
      }

      let reviews;

      if (batchSize === undefined) {
        reviews = await db.review.findMany({
          where: {
            userId,
          },
          orderBy: {
            updatedAt: "desc",
          },
        });
      } else {
        if (cursor === undefined) {
          reviews = await db.review.findMany({
            take: parseInt(batchSize),
            where: {
              userId,
            },

            orderBy: {
              updatedAt: "desc",
            },
          });
        } else {
          reviews = await db.review.findMany({
            take: parseInt(batchSize),
            where: {
              userId,
            },
            cursor: {
              id: cursor,
            },
            skip: 1,
            orderBy: {
              updatedAt: "desc",
            },
          });
        }
      }

      let nextCursor = null;

      if (batchSize && reviews.length === parseInt(batchSize)) {
        nextCursor = reviews[reviews.length - 1].id;
      }

      return c.json({ reviews, nextCursor }, 200);
    }
  )
  .get("/highest-rated", clerkMiddleware(), async c => {
    const auth = getAuth(c);

    if (!auth || !auth.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized" }, 401),
      });
    }

    const { userId } = auth;

    const highestRatedBooks = await db.review.findMany({
      where: {
        userId,
        rating: {
          gte: 4,
        },
      },
      orderBy: {
        rating: "desc",
      },
      take: 10,
    });

    console.log({ highestRatedBooks });
    return c.json({ highestRatedBooks }, 200);
  })
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        bookId: z.string(),
        review: z.string(),
        rating: z.number().int().min(1).max(5),
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
      const { bookId, review, rating } = c.req.valid("json");

      const userFavoriteBook = await db.favorite.findFirst({
        where: {
          userId,
          bookId,
        },
      });

      if (!userFavoriteBook) {
        throw new HTTPException(404, {
          res: c.json(
            { error: "Book is not in the user's favorite list." },
            404
          ),
        });
      }

      const existingReview = await db.review.findFirst({
        where: {
          userId,
          bookId,
        },
      });

      let newReview;

      if (existingReview) {
        // Update the existing review
        newReview = await db.review.update({
          where: { id: existingReview.id },
          data: { review, rating },
        });
      } else {
        // Insert a new review
        newReview = await db.review.create({
          data: { userId, bookId, review, rating },
        });
      }

      return c.json({ newReview }, 200);
    }
  )
  .patch(
    "/:reviewId",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({ review: z.string(), rating: z.number().int().min(1).max(5) })
    ),
    async c => {
      const auth = getAuth(c);

      if (!auth || !auth.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      const { userId } = auth;
      const { review, rating } = c.req.valid("json");
      const { reviewId } = c.req.param();

      const existingReview = await db.review.findFirst({
        where: {
          id: reviewId,
          userId,
        },
      });

      if (!existingReview) {
        throw new HTTPException(404, {
          res: c.json({ error: "Review not found" }, 404),
        });
      }

      const updatedReview = await db.review.update({
        where: { id: reviewId },
        data: { review, rating },
      });

      return c.json({ updatedReview }, 200);
    }
  );

export default app;
