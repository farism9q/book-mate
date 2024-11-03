import { Hono } from "hono";
import { handle } from "hono/vercel";
import favoriteBooks from "./favorite-books";
import googleBooks from "./google-books";
import conversations from "./conversations";
import account from "./account";
import review from "./review";
import userLimit from "./user-limit";
import llm from "./llm";
import userBooksPrefrences from "./user-books-prefrences";
import document from "./document";

export const runtime = "nodejs";

const app = new Hono().basePath("/api");

const routes = app
  .route("/favorite-books", favoriteBooks)
  .route("/google-books", googleBooks)
  .route("/conversations", conversations)
  .route("/account", account)
  .route("/review", review)
  .route("/user-limit", userLimit)
  .route("/llm", llm)
  .route("/user-books-prefrences", userBooksPrefrences)
  .route("/document", document);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
