import { db } from "@/lib/db";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

const app = new Hono().post(
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
        res: c.json({ error: "Book is not in the user's favorite list." }, 404),
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
);

export default app;
