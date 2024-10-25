import { getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { clerkMiddleware } from "@hono/clerk-auth";
import { HTTPException } from "hono/http-exception";
import { zValidator } from "@hono/zod-validator";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";

const app = new Hono().post(
  "/",
  clerkMiddleware(),
  zValidator(
    "json",
    z.object({
      prompt: z.string().describe("The prompt to send to the LLM"),
      system: z.string().describe("The system prompt to send to the LLM"),
    })
  ),
  async c => {
    const auth = getAuth(c);

    if (!auth || !auth.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized" }, 401),
      });
    }

    const { prompt, system } = await c.req.json();

    console.log({ promptInLLM: prompt });

    if (!prompt) {
      throw new HTTPException(400, {
        res: c.json({ error: "Prompt is required" }, 400),
      });
    }

    const result = await generateObject({
      model: openai("gpt-4o-mini") as any,
      system,
      prompt,
      schema: z.object({
        books: z.array(
          z.object({
            title: z.string().describe("The title of the book"),
          })
        ),
      }),
    });

    console.log({ result: result.object.books });

    return c.json({
      suggestedBooks: result.object.books,
    });
  }
);

export default app;
