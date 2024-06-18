"use client";
import { useGetBooks } from "@/features/books/api/use-get-books";

import { BOOKS_PER_PAGE } from "@/constants";
import { Book } from "@/types/book";

import { BookCard } from "@/components/book-card";
import { SearchBooksAction } from "@/features/books/components/search-books-action";
import CustomPagination from "@/components/custom-pagination";
import BookCardSkeleton from "@/components/book-card-skeleton";

type Props = {
  title: string;
  page: string;
};

export const SearchBook = ({ title, page }: Props) => {
  const currPage = !page ? 0 : +page - 1;

  const { data: books, isLoading } = useGetBooks({
    query: {
      q: title,
      printType: "books",
      page: currPage,
      startIndex: currPage * BOOKS_PER_PAGE, // intial page is "undifined" so we set it to "0".
      maxResults: BOOKS_PER_PAGE,
    },
    queryKey: ["search", title, currPage.toString()],
  });

  return (
    <>
      <SearchBooksAction isFetching={false} type="search" />

      {isLoading && <LoadingSkeleton />}

      <div className="flex flex-col justify-center items-center pt-24 space-y-24 overflow-y-auto">
        {books && (
          <div className="flex flex-col items-center space-y-6">
            {books.length === 0 && (
              <div className="text-center text-lg text-gray-500">
                No books found.
              </div>
            )}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {books.map((book: Book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {books.length > 0 && <CustomPagination />}
          </div>
        )}
      </div>
    </>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: 12 }).map((_, idx) => (
        <BookCardSkeleton key={idx} />
      ))}
    </div>
  );
};
