import { getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { clerkMiddleware } from "@hono/clerk-auth";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "@/lib/db";

const app = new Hono()
  .get("/", clerkMiddleware(), async c => {
    const auth = getAuth(c);

    if (!auth || !auth.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized" }, 401),
      });
    }

    const userBookPreferences = await db.userBookPreferences.findFirst({
      where: {
        user: {
          userClerkId: auth.userId,
        },
      },
    });

    return c.json({
      userBookPreferences,
    });
  })
  .post(
    "/",
    clerkMiddleware(),
    zValidator(
      "json",
      z.object({
        genres: z.array(z.string()).describe("The genres the user likes"),
      })
    ),
    async c => {
      const auth = getAuth(c);

      if (!auth || !auth.userId) {
        throw new HTTPException(401, {
          res: c.json({ error: "Unauthorized" }, 401),
        });
      }

      const { genres } = await c.req.json();

      if (!genres) {
        throw new HTTPException(400, {
          res: c.json({ error: "Genres are required" }, 400),
        });
      }

      const userBookPreferences = await db.userBookPreferences.create({
        data: {
          userId: auth.userId,
          genres,
        },
      });

      return c.json({
        userBookPreferences,
      });
    }
  );

export default app;
