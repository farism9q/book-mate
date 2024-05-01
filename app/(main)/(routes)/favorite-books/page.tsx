import qs from "query-string";
import axios from "axios";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { Book } from "@/types/book";

import { BookCard } from "@/components/book/book-card";
import RoutePage from "@/components/route-page";
import Empty from "@/components/empty";
import { auth } from "@clerk/nextjs";
import { FavoriteBookStatus } from "@prisma/client";

const filterOpt = [
  { value: "all", label: `All` },
  { value: "finished", label: `Finished` },
  { value: "will_read", label: `Will read` },
  { value: "reading", label: `Reading` },
];
const sortOpt = [
  { value: "desc", label: "Newest" },
  { value: "asc", label: "Oldest" },
];

type Props = {
  params: {};
  searchParams: {
    filter: string;
    date: string;
  };
};

const FavoriteBooksPage = async ({ searchParams }: Props) => {
  const { userId } = auth();

  const { filter, date } = searchParams;

  const status =
    filter !== "all" ? filter?.replace(" ", "_").toUpperCase() : undefined;

  if (!userId) {
    return redirect("/");
  }

  let favoriteBooks = await db.favorite.findMany({
    where: {
      userId,
      status: status as FavoriteBookStatus,
    },
    orderBy: {
      createdAt: (date as "asc" | "desc") || "desc",
    },
  });

  // Map over the favoriteBooksIds to create an array of promises
  const bookPromises = favoriteBooks.map(favoriteBook => {
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

  const noFavBooks =
    (filter === "all" || filter === undefined) && books.length === 0;

  const emptyLabel = noFavBooks
    ? "There is no favorite book"
    : "No books found";
  const emptyDescription = noFavBooks
    ? "Save your favorite books to see them here."
    : `Couldn't find any books with the filter "${filter}"`;

  return (
    <RoutePage
      title="Favorite Books"
      filter={
        noFavBooks ? undefined : { options: filterOpt, urlQuery: "filter" }
      }
      sort={
        noFavBooks
          ? undefined
          : {
              options: sortOpt,
              urlQuery: "date",
            }
      }
    >
      {books.length > 0 ? (
        <div className="flex flex-col justify-center items-center space-y-24 overflow-y-auto">
          <div className="flex flex-col items-center space-y-6">
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {books.map((book, idx) => (
                <BookCard
                  key={book.id}
                  book={book}
                  favBookId={favoriteBooks[idx].id}
                  favBookStatus={favoriteBooks[idx].status}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <Empty
          label={emptyLabel}
          description={emptyDescription}
          img={{
            src: noFavBooks ? "/add-book.png" : "/not-found.png",
            alt: noFavBooks ? "Add book" : "Not found",
          }}
          clickable={noFavBooks ? true : false}
          onClickHrf={noFavBooks ? "/books" : undefined}
        />
      )}
    </RoutePage>
  );
};

export default FavoriteBooksPage;
