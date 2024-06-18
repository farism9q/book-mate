import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetConversationLimit = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const { data, error, isLoading } = useQuery({
    queryKey: [`chat-${conversationId}-limit`],

    queryFn: async () => {
      const response = await client.api.conversations["chat-limit"][
        ":conversationId"
      ].$get({
        param: {
          conversationId,
        },
      });

      if (!response.ok) {
        throw new Error("An error occurred while fetching conversation limit");
      }

      const { bookChatCounts } = await response.json();

      return bookChatCounts;
    },
  });

  return { data, error, isLoading };
};
