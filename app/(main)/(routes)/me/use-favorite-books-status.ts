import axios from "axios";
import qs from "query-string";
import { useQuery } from "@tanstack/react-query";

import { getUserBooksByStatus } from "@/actions/books";

import { FavoriteBookStatus } from "@prisma/client";
import { Book } from "@/types/book";

export function useUserFavBooksByStatus({
  userId,
  status,
}: {
  userId: string;
  status: FavoriteBookStatus | null;
}) {
  const fetchUserBooksByStatus = async () => {
    if (!userId || !status) {
      return null;
    }

    // Fetch user books by status
    const userBooks = await getUserBooksByStatus({ userId, status });

    if (!userBooks) {
      return [];
    }

    // Map over the favoriteBooksIds to create an array of promises
    const bookPromises = userBooks?.map(favoriteBook => {
      const url = qs.stringifyUrl({
        url: `https://www.googleapis.com/books/v1/volumes/${favoriteBook.book.id}`,
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
        favorite: userBooks[idx],

        book: {
          id: response.data.id,
          volumeInfo: { ...response.data.volumeInfo },
        } as Book,
      };
    });

    return books || [];
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [`user:${userId}:books:${status}`],
    queryFn: fetchUserBooksByStatus,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    data,
    isLoading,
    error,
  };
}
