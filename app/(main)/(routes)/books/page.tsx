"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

import { Category, BOOKS_PER_PAGE } from "@/constants";
import { Book } from "@/types/book";
import { subscriptionType } from "@/types/subscription";

import { SearchBooksAction } from "@/features/books/components/search-books-action";
import CustomPagination from "@/components/custom-pagination";
import BookCardSkeleton from "@/components/book-card-skeleton";
import { BookCard } from "@/components/book-card";
import { useGetBooks } from "@/features/books/api/use-get-books";
import ForYouBooks from "@/components/for-you-books";
import { useGetUserBooksGenres } from "@/features/user-books-prefrences/api/use-get-user-books-genres";
import { useGetUserHighRatedBooks } from "@/features/review/api/use-get-user-high-rated-books";
import { useGetFavoriteBooks } from "@/features/favorite-books/api/use-get-favorite-books";

const InitialPage = () => {
  const searchParams = useSearchParams();
  const { onOpen } = useModal();
  const [hasOpenedModal, setHasOpenedModal] = useState(false);

  const cameFromSubscription = searchParams.get("subscription");

  const category =
    (searchParams.get("category") as Category) || Category.HEALTH;
  const currentPage = Number(searchParams.get("page")) || 0;

  const { data, isLoading } = useGetBooks({
    query: {
      q: `subject:${category}`,
      printType: "books",
      page: currentPage,
      startIndex: currentPage * BOOKS_PER_PAGE,
      maxResults: BOOKS_PER_PAGE,
    },
    queryKey: ["books", category, currentPage.toString()],
  });

  const { data: highRatedBooks, isLoading: isHighRatedBooksLoading } =
    useGetUserHighRatedBooks();
  const { data: favoriteBooks, isLoading: isFavoriteBooksLoading } =
    useGetFavoriteBooks({
      sort: "desc",
    });
  const { data: userBooksGenres, isLoading: isUserBooksGenresLoading } =
    useGetUserBooksGenres();

  useEffect(() => {
    console.log(userBooksGenres, isUserBooksGenresLoading);
    if (!userBooksGenres && !isUserBooksGenresLoading) {
      onOpen("userBooksPrefrences");
      setHasOpenedModal(true);
    }
  }, [onOpen, hasOpenedModal, isUserBooksGenresLoading, userBooksGenres]);

  useEffect(() => {
    if (
      (cameFromSubscription === subscriptionType.SUBSCRIBE.toLowerCase() ||
        cameFromSubscription === subscriptionType.UPDATE.toLowerCase()) &&
      !hasOpenedModal
    ) {
      onOpen("subscriptionSuccess");
      setHasOpenedModal(true);
    }
  }, [cameFromSubscription, hasOpenedModal, onOpen]);

  return (
    <div className="flex flex-col w-full overflow-y-auto no-scrollbar px-4">
      <div className="space-y-8">
        <div className="mt-12 px-2">
          <SearchBooksAction isFetching={isLoading} type="initial" />
        </div>

        {highRatedBooks &&
        favoriteBooks &&
        !isFavoriteBooksLoading &&
        !isHighRatedBooksLoading ? (
          <ForYouBooks
            highRatedBooks={highRatedBooks?.books || []}
            favoriteBooks={favoriteBooks?.books || []}
            genrePrefrences={userBooksGenres!}
          />
        ) : userBooksGenres && !isLoading ? (
          <ForYouBooks
            highRatedBooks={[]}
            favoriteBooks={[]}
            genrePrefrences={userBooksGenres!}
          />
        ) : null}

        {/* Is loading */}
        {isLoading && <LoadingSkeleton />}

        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 px-2">
              {data?.map((book: Book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            <div className="py-2">
              <CustomPagination />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InitialPage;

const LoadingSkeleton = () => {
  return (
    <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
      {Array.from({ length: 12 }).map((_, idx) => (
        <BookCardSkeleton key={idx} />
      ))}
    </div>
  );
};
