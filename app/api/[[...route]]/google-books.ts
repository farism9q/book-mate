import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { object, z } from "zod";
import { HTTPException } from "hono/http-exception";
import axios from "axios";
import qs from "query-string";
import { Book } from "@/types/book";

const app = new Hono().post(
  "/",
  clerkMiddleware(),
  zValidator(
    "json",
    object({
      booksId: z.array(z.string()).optional(),

      query: z
        .object({
          q: z.string(),
          printType: z.string(),
          page: z.number(),
          startIndex: z.number(),
          maxResults: z.number(),
          langRestrict: z.enum(["en", "ar"]).default("en"),
        })
        .optional(),
    })
  ),

  async c => {
    const auth = getAuth(c);

    if (!auth?.userId) {
      throw new HTTPException(401, {
        res: c.json({ error: "Unauthorized" }, 401),
      });
    }

    const { booksId, query } = c.req.valid("json");

    let books: Book[] = [];

    if (query && query.q.trim() === "") {
      return c.json({ books: [] });
    }

    if (booksId && booksId.length > 0) {
      // 1) Map over the favoriteBooksIds to create an array of promises
      const booksPromise = booksId.map(bookId => {
        return axios.get(
          `https://www.googleapis.com/books/v1/volumes/${bookId}?key=${process.env.GOOGLE_BOOK_API_KEY}`
        );
      });

      // 2) Call the books API to get the books using promise.all
      const booksResponses = await Promise.all(booksPromise);

      // 3) Extract the book data from the responses
      books.push(
        ...booksResponses.map(response => {
          return {
            id: response.data.id,
            volumeInfo: { ...response.data.volumeInfo },
          } as Book;
        })
      );
    }

    if (query) {
      const url = qs.stringifyUrl({
        url: "https://www.googleapis.com/books/v1/volumes",
        query: {
          ...query,
          key: process.env.GOOGLE_BOOK_API_KEY,
        },
      });

      const booksResponses = await axios.get(url);

      // 2) Extract the book data from the responses
      books.push(
        ...booksResponses.data.items.map((response: any) => {
          return {
            id: response.id,
            volumeInfo: { ...response.volumeInfo },
          } as Book;
        })
      );
    }

    return c.json({ books });
  }
);

export default app;
