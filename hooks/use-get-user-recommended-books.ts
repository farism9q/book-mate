import { useGetFavoriteBooks } from "@/features/favorite-books/api/use-get-favorite-books";
import { useGetUserHighRatedBooks } from "@/features/review/api/use-get-user-high-rated-books";
import { useGetUserBooksGenres } from "@/features/user-books-prefrences/api/use-get-user-books-genres";

import { client } from "@/lib/hono";
import { suggestedBooksCacheTime } from "@/lib/utils";
import { Book } from "@/types/book";
import { UserBookPreferences } from "@prisma/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type LocalUserBookPreferences = Pick<
  UserBookPreferences,
  "id" | "userId" | "genres"
> & {
  createdAt: string;
  updatedAt: string;
};

async function getUserRecommendedBooks({
  page,
  highRatedBooks,
  favoriteBooks,
  genrePrefrences,
  previousSuggestedBooks,
}: {
  page: number;
  highRatedBooks: Book[];
  favoriteBooks: Book[];
  genrePrefrences: LocalUserBookPreferences;
  previousSuggestedBooks: Book[] | undefined;
}) {
  let userGenrePrefrences: LocalUserBookPreferences | undefined;
  if (highRatedBooks.length === 0 && favoriteBooks.length === 0) {
    userGenrePrefrences = genrePrefrences;
  }

  const prompt = prepareLLMPromt({
    books: highRatedBooks.length > 0 ? highRatedBooks : favoriteBooks,
    previousSuggestedBooks,
    userGenrePrefrences: userGenrePrefrences?.genres,
  });

  const response = await client.api.llm.$post({
    json: { prompt, system: "You are a book recommendation system." },
  });

  const { suggestedBooks } = await response.json();

  // Fetch the suggested books from google books API
  const fetchedBooks = await Promise.all(
    suggestedBooks.map(async book => {
      const startIndex = page - 1;
      const response = await client.api["google-books"].$post({
        json: {
          booksId: undefined,
          query: {
            q: book.title,
            page: 0,
            printType: "books",
            startIndex,
            maxResults: 1,
          },
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get user recommended books");
      }

      const { books: fetchedBooks } = await response.json();

      return fetchedBooks[0];
    })
  );

  return fetchedBooks;
}

export function useGetUserRecommendedBooks({ page }: { page: number }) {
  const clientQuery = useQueryClient();

  const previousSuggestedBooks = clientQuery.getQueryData<Book[]>([
    "user-recommended-books",
    page - 1,
  ]);

  const { data: highRatedBooks, isLoading: isHighRatedBooksLoading } =
    useGetUserHighRatedBooks();
  const { data: favoriteBooks, isLoading: isFavoriteBooksLoading } =
    useGetFavoriteBooks({
      sort: "desc",
    });

  const { data: userBooksGenres, isLoading: isUserBooksGenresLoading } =
    useGetUserBooksGenres();

  const enabled =
    userBooksGenres && favoriteBooks?.books && highRatedBooks?.books;

  const isLoadingRelatedData =
    isHighRatedBooksLoading ||
    isFavoriteBooksLoading ||
    isUserBooksGenresLoading;

  const { data, isLoading, error } = useQuery({
    queryKey: ["user-recommended-books", page],
    staleTime: suggestedBooksCacheTime,
    enabled: !!enabled,
    queryFn: () =>
      getUserRecommendedBooks({
        page,
        highRatedBooks: highRatedBooks?.books!,
        favoriteBooks: favoriteBooks?.books!,
        genrePrefrences: userBooksGenres!,
        previousSuggestedBooks,
      }),
  });

  // Prefetch the next page
  clientQuery.prefetchQuery({
    queryKey: ["user-recommended-books", page + 1],
    queryFn: () => {
      const previousSuggestedBooks = clientQuery.getQueryData<Book[]>([
        "user-recommended-books",
        page,
      ]);

      return getUserRecommendedBooks({
        page: page + 1,
        highRatedBooks: highRatedBooks?.books!,
        favoriteBooks: favoriteBooks?.books!,
        genrePrefrences: userBooksGenres!,
        previousSuggestedBooks,
      });
    },
  });

  return {
    data,
    isLoading: isLoading || isLoadingRelatedData,
    error,
  };
}

function prepareLLMPromt({
  books,
  previousSuggestedBooks,
  userGenrePrefrences,
}: {
  books: Book[];
  previousSuggestedBooks: Book[] | undefined;
  userGenrePrefrences: string[] | undefined;
}) {
  let prompt = "";

  if (previousSuggestedBooks) {
    prompt += `You already suggested these books to the user: ${previousSuggestedBooks
      .map(book => book.volumeInfo.title)
      .join(", ")}.`;
  }

  if (userGenrePrefrences) {
    prompt += `The user likes ${userGenrePrefrences.join(", ")} genre.`;
  }

  prompt = `You are a book recommendation system. You are given a list of books and a user's genre preferences. Your task is to suggest 12 books similar to user taste.
  ${books
    .map(
      book =>
        `- ${book.volumeInfo.title} by ${book.volumeInfo.authors?.join(", ")}`
    )
    .join("\n")}
  ${prompt}
  `;

  return prompt;
}
