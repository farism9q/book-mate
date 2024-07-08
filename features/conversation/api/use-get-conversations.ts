import { useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetBookConversations = ({ sort }: { sort?: string }) => {
  const queryClient = useQueryClient();
  const { data, error, isLoading } = useQuery({
    queryKey: ["book-conversations", sort], // QUERY KEY

    queryFn: async () => {
      const response = await client.api.conversations.$get({
        query: {
          sort,
        },
      });

      if (!response.ok) {
        throw new Error("An error occurred while fetching favorite books");
      }

      const { conversations } = await response.json();

      const booksResponse = await client.api["google-books"].$post({
        json: {
          booksId: conversations.map(conversation => conversation.bookId),
        },
      });

      if (!booksResponse.ok) {
        throw new Error("An error occurred while fetching books");
      }

      const { books } = await booksResponse.json();
      queryClient.setQueryData(["books"], books);

      return { conversations, chattedBooks: books };
    },
  });

  return { data, error, isLoading };
};
