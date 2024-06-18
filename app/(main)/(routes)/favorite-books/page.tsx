"use client";

import { useGetFavoriteBooks } from "@/features/favorite-books/api/use-get-favorite-books";

import { BookCard } from "@/components/book-card";
import RoutePage from "@/components/route-page";
import Empty from "@/components/empty";
import BookCardSkeleton from "@/components/book-card-skeleton";

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

const FavoriteBooksPage = ({ searchParams }: Props) => {
  const { filter, date } = searchParams;

  const status =
    filter !== "all" ? filter?.replace(" ", "_").toUpperCase() : undefined;

  const { data, isLoading } = useGetFavoriteBooks({
    filter: status,
    sort: date,
  });

  const favoriteBooks = data ? data.favoriteBooks : [];
  const books = data ? data.books : [];

  const noFavBooks =
    (filter === "all" || filter === undefined) && books?.length === 0;

  const emptyLabel = noFavBooks
    ? "There is no favorite book"
    : "No books found";

  const alteredFilter = filter?.replaceAll("_", " ").toUpperCase();

  const emptyDescription = noFavBooks
    ? "Save your favorite books to see them here."
    : `Couldn't find any books with the filter "${alteredFilter}"`;

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
      {isLoading && <LoadingSkeleton />}
      {books.length > 0 && !isLoading && (
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
      )}
      {books.length === 0 && !isLoading && (
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

const LoadingSkeleton = () => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: 12 }).map((_, idx) => (
        <BookCardSkeleton key={idx} />
      ))}
    </div>
  );
};
