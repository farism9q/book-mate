import { db } from "@/lib/db";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { z } from "zod";

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
      throw new HTTPException(400, {
        res: c.json({ error: "User limit not found" }, 400),
      });
    }

    return c.json({ userLimit }, 200);
  }
);

export default app;
