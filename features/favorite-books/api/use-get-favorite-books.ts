import { useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { suggestedBooksCacheTime } from "@/lib/utils";

export const useGetFavoriteBooks = ({
  filter,
  sort,
}: {
  filter?: string;
  sort?: string;
}) => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["favorite-books", filter, sort],
    staleTime: suggestedBooksCacheTime,

    queryFn: async () => {
      const response = await client.api["favorite-books"].$get({
        query: {
          filter,
          sort,
        },
      });

      if (!response.ok) {
        throw new Error("An error occurred while fetching favorite books");
      }

      const { favoriteBooks } = await response.json();

      const booksResponse = await client.api["google-books"].$post({
        json: {
          booksId: favoriteBooks.map(book => book.bookId),
        },
      });

      if (!booksResponse.ok) {
        throw new Error("An error occurred while fetching books");
      }

      const { books } = await booksResponse.json();
      queryClient.setQueryData(["books"], books);

      queryClient.invalidateQueries({
        queryKey: ["user-recommended-books"],
      });

      return { favoriteBooks, books };
    },
  });

  return { data, error, isLoading };
};
