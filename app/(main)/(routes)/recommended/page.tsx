import ForYouBooks from "@/components/for-you-books";
import { useGetFavoriteBooks } from "@/features/favorite-books/api/use-get-favorite-books";
import { useGetUserHighRatedBooks } from "@/features/review/api/use-get-user-high-rated-books";
import { useGetUserBooksGenres } from "@/features/user-books-prefrences/api/use-get-user-books-genres";
import React from "react";

const RecommendedBooksPage = () => {
  const { data: highRatedBooks, isLoading: isHighRatedBooksLoading } =
    useGetUserHighRatedBooks();
  const { data: favoriteBooks, isLoading: isFavoriteBooksLoading } =
    useGetFavoriteBooks({
      sort: "desc",
    });

  const { data: userBooksGenres, isLoading: isUserBooksGenresLoading } =
    useGetUserBooksGenres();
  return (
    <div>
      {highRatedBooks &&
      favoriteBooks &&
      !isFavoriteBooksLoading &&
      !isHighRatedBooksLoading ? (
        <ForYouBooks
          highRatedBooks={highRatedBooks?.books || []}
          favoriteBooks={favoriteBooks?.books || []}
          genrePrefrences={userBooksGenres!}
          sample
        />
      ) : userBooksGenres && !isUserBooksGenresLoading ? (
        <ForYouBooks
          highRatedBooks={[]}
          favoriteBooks={[]}
          genrePrefrences={userBooksGenres!}
          sample
        />
      ) : null}
      )
    </div>
  );
};

export default RecommendedBooksPage;
