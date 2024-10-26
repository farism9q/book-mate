import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetUserReviewsInfinite = ({
  batchSize,
}: {
  batchSize?: number;
} = {}) => {
  const queryClient = useQueryClient();

  return useInfiniteQuery({
    queryKey: ["user-reviews"],
    queryFn: async ({ pageParam }) => {
      const response = await client.api.review.$get({
        query: {
          cursor: pageParam,
          batchSize: batchSize ? batchSize.toString() : undefined,
        },
      });

      if (!response.ok) {
        throw new Error("An error occurred while fetching user reviews");
      }

      const { reviews, nextCursor } = await response.json();

      const booksResponse = await client.api["google-books"].$post({
        json: {
          booksId: reviews.map(review => review.bookId),
        },
      });

      if (!booksResponse.ok) {
        throw new Error("An error occurred while fetching books");
      }

      const { books } = await booksResponse.json();

      return { books, reviews, nextCursor };
    },
    initialPageParam: "",
    getNextPageParam: lastPage => lastPage.nextCursor,
  });
};
