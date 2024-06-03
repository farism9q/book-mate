"use server";

import { db } from "@/lib/db";
import { Book } from "@/types/book";
import { FavoriteBookStatus } from "@prisma/client";
import axios from "axios";
import qs from "query-string";

export async function getUserBooksByStatus({
  userId,
  status,
}: {
  userId: string;
  status: FavoriteBookStatus;
}) {
  if (!userId) {
    throw new Error("Missing user id.");
  }

  // Fetch user books by status
  const userBooks = await db.user.findFirst({
    where: {
      userClerkId: userId,
    },
    select: {
      favorites: {
        where: {
          status,
        },
        orderBy: {
          updatedAt: "desc",
        },
      },
    },
  });

  if (!userBooks?.favorites) {
    return [];
  }

  // Map over the favoriteBooksIds to create an array of promises
  const bookPromises = userBooks.favorites.map(favoriteBook => {
    const url = qs.stringifyUrl({
      url: `https://www.googleapis.com/books/v1/volumes/${favoriteBook.bookId}`,
      query: {
        key: process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY,
      },
    });
    return axios.get(url);
  });

  // 1) Call the books API to get the books using promise.all
  const booksResponses = await Promise.all(bookPromises);
  // 2) Extract the book data from the responses
  const books = booksResponses.map((response, idx) => {
    return {
      favorite: userBooks.favorites[idx],

      book: {
        id: response.data.id,
        volumeInfo: { ...response.data.volumeInfo },
      } as Book,
    };
  });

  return books || [];
}
