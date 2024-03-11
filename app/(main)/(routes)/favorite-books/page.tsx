import qs from "query-string";
import axios from "axios";
import { Staatliches } from "next/font/google";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { initialUser } from "@/lib/initial-user";
import { cn } from "@/lib/utils";

import { Book } from "@/types";
import BookCard from "@/components/book/book-card";

const font = Staatliches({ subsets: ["latin"], weight: "400" });

const FavoriteBooksPage = async () => {
  const user = await initialUser();
  if (!user) {
    return redirect("/");
  }

  const favoriteBooksIds = await db.favorite.findMany({
    where: {
      userId: user.id,
    },
  });

  // Map over the favoriteBooksIds to create an array of promises
  const bookPromises = favoriteBooksIds.map(favoriteBook => {
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
  const books = booksResponses.map(response => {
    return {
      id: response.data.id,
      volumeInfo: { ...response.data.volumeInfo },
    } as Book;
  });

  return (
    <div className="flex flex-col py-12">
      <div className="flex flex-col justify-center items-center pt-24 space-y-24 overflow-y-auto">
        <div className="flex flex-col justify-center items-center space-y-4">
          <p className="text-zinc-500 dark:text-zinc-400">Results of</p>
          <h1
            className={cn(
              "text-5xl font-bold text-primary capitalize",
              font.className
            )}
          >
            Favorite Books
          </h1>
        </div>

        <div className="flex flex-col items-center space-y-6">
          <div className="grid mx-8 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {books.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoriteBooksPage;
