import { useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { suggestedBooksCacheTime } from "@/lib/utils";

export const useGetUserHighRatedBooks = () => {
  const clientQuery = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-high-rated-books"],
    staleTime: suggestedBooksCacheTime,
    queryFn: async () => {
      const response = await client.api.review["highest-rated"].$get();

      const { highestRatedBooks } = await response.json();

      const booksResponse = await client.api["google-books"].$post({
        json: {
          booksId: highestRatedBooks.map(book => book.bookId),
        },
      });

      if (!booksResponse.ok) {
        throw new Error("An error occurred while fetching books");
      }

      const { books } = await booksResponse.json();

      clientQuery.invalidateQueries({
        queryKey: ["user-recommended-books"],
      });

      return { highestRatedBooks, books };
    },
  });

  return { data, isLoading, isError };
};
