import axios from "axios";
import { redirect } from "next/navigation";
import qs from "query-string";
import { Metadata } from "next";

import { BOOKS_PER_PAGE } from "@/constants";
import { Book } from "@/types/book";

import { BookCard } from "@/components/book/book-card";
import { SearchBooksAction } from "@/components/search-books-action";
import CustomPagination from "@/components/custom-pagination";
import RoutePage from "@/components/route-page";

type BookTitlePageProps = {
  params: {};
  searchParams: { title: string; page: string };
};

export const generateMetadata = ({
  searchParams,
}: BookTitlePageProps): Metadata => {
  return {
    title: `Book - ${searchParams.title}`,
    description: `Everything about ${searchParams.title} book.`,
  };
};

const BookTitlePage = async ({ params, searchParams }: BookTitlePageProps) => {
  const { title, page } = searchParams;

  if (!title) {
    return redirect("/");
  }

  const currPage = !page ? 0 : +page - 1;

  const url = qs.stringifyUrl({
    url: "https://www.googleapis.com/books/v1/volumes",
    query: {
      q: title,
      printType: "books",
      page: currPage,
      startIndex: currPage * BOOKS_PER_PAGE, // intial page is "undifined" so we set it to "0".
      maxResults: BOOKS_PER_PAGE,
      key: process.env.GOOGLE_BOOK_API_KEY,
    },
  });

  const response = await axios.get(url);
  const books = response.data.items || [];

  return (
    <RoutePage title={title} className="space-y-4">
      <SearchBooksAction />
      <div className="flex flex-col justify-center items-center pt-24 space-y-24 overflow-y-auto">
        <div className="flex flex-col items-center space-y-6">
          {books.length === 0 && (
            <div className="text-center text-lg text-gray-500">
              No books found.
            </div>
          )}
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {books.map((book: Book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          {books.length > 0 && <CustomPagination />}
        </div>
      </div>
    </RoutePage>
  );
};

export default BookTitlePage;
