import axios from "axios";
import { redirect } from "next/navigation";
import qs from "query-string";
import Image from "next/image";
import { Staatliches } from "next/font/google";

import { cn } from "@/lib/utils";
import { db } from "@/lib/db";
import { initialUser } from "@/lib/initial-user";
import { extractCategories } from "@/lib/book";

import { Book } from "@/types";
import { Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Head from "next/head";
import AddBook from "@/components/add-book";
import ChatBook from "@/components/chat-book";

interface BookDetailPageProps {
  params: {
    bookId: string;
  };
}

const font = Staatliches({ subsets: ["latin"], weight: "400" });

const BookTitlePage = async ({ params }: BookDetailPageProps) => {
  const { bookId } = params;
  const user = await initialUser();

  if (!user) {
    return redirect("/");
  }

  if (!bookId) {
    return redirect("/");
  }

  const url = qs.stringifyUrl({
    url: `https://www.googleapis.com/books/v1/volumes/${bookId}`,

    query: {
      key: process.env.GOOGLE_BOOK_API_KEY,
    },
  });

  const response = await axios.get(url);

  const book = response.data as Book;

  const userFav = await db.user.findUnique({
    where: {
      id: user.id,
      favorites: {
        some: {
          bookId: book.id,
        },
      },
    },
  });

  const categories = extractCategories(book.volumeInfo.categories);

  return (
    <>
      <title>{`${book.volumeInfo.title}`}</title>
      <meta name="description" content={`${book.volumeInfo.title} book.`} />
      <div className="py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative aspect-square w-full h-full">
            <Image
              fill
              src={book.volumeInfo.imageLinks?.thumbnail || ""}
              alt={book.volumeInfo.title}
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <h1
              className={cn("text-3xl font-bold text-primary", font.className)}
            >
              {book.volumeInfo.title}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              By &nbsp;
              <span className="text-md text-primary">
                {book.volumeInfo.authors?.join(", ")}
              </span>
            </p>
            {book.volumeInfo.averageRating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span className="text-xs font-bold">
                    {book.volumeInfo.averageRating}
                  </span>
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {book.volumeInfo.ratingsCount} ratings
                </span>
              </div>
            )}
            <span className="text-xs text-zinc-500 dark:text-zinc-200">
              {book.volumeInfo.pageCount} pages
            </span>

            <Separator />
            <div className="grid grid-cols-3 gap-2">
              {Array.from(categories).map((category: string) => (
                <Badge variant={"secondary"} key={category}>
                  {category.toUpperCase()}
                </Badge>
              ))}
            </div>

            <p className="text-zinc-500 dark:text-zinc-200 text-sm">
              {book.volumeInfo.description}
            </p>
            {!userFav ? (
              <AddBook bookId={book.id} />
            ) : (
              <ChatBook bookId={book.id} />
            )}
          </div>
          <div className="flex flex-col space-y-4 bg-primary/20 border-2 border-primary rounded-lg p-3">
            <h3 className="uppercase text-primary text-3xl">Product details</h3>
            <div className="flex items-center justify-between">
              <span className="uppercase text-zinc-500 dark:text-zinc-400">
                Published Date
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {book.volumeInfo.publishedDate}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="uppercase text-zinc-500 dark:text-zinc-400">
                Publisher
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {book.volumeInfo.publisher}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookTitlePage;
