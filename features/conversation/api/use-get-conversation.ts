import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { Conversation } from "@prisma/client";

export const useGetConversation = ({ bookId }: { bookId: string }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: [`book-${bookId}-conversation`],

    queryFn: async () => {
      const response = await client.api.conversations.$post({
        json: {
          bookId,
        },
      });

      if (!response.ok) {
        throw new Error("An error occurred while fetching conversation");
      }

      const { conversation } = await response.json();

      return {
        ...conversation,
        createdAt: new Date(conversation.createdAt),
        updatedAt: new Date(conversation.updatedAt),
      } as Conversation;
    },
  });

  return { data, error, isLoading };
};
