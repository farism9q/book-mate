import { db } from "@/lib/db";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";

const app = new Hono().get(
  "/",
  clerkMiddleware(),

  async c => {
    const auth = getAuth(c);

    if (!auth || !auth.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized" }, 401),
      });
    }

    const { userId } = auth;

    const userLimit = await db.userLimit.findFirst({
      where: {
        userId,
      },
      select: {
        count: true,
      },
    });

    if (!userLimit) {
      return c.json({ userLimit: { count: 0 } }, 200);
    }

    return c.json({ userLimit }, 200);
  }
);

export default app;
