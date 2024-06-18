import { Hono } from "hono";
import { handle } from "hono/vercel";
import { HTTPException } from "hono/http-exception";
import favoriteBooks from "./favorite-books";
import googleBooks from "./google-books";
import conversations from "./conversations";
import account from "./account";
import review from "./review";
import userLimit from "./user-limit";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return err.getResponse();
  }

  return c.json({ error: "Internal server error" }, 500);
});

const routes = app
  .route("/favorite-books", favoriteBooks)
  .route("/google-books", googleBooks)
  .route("/conversations", conversations)
  .route("/account", account)
  .route("/review", review)
  .route("/user-limit", userLimit);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
