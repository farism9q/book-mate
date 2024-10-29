import { useInfiniteQuery } from "@tanstack/react-query";
import { client } from "@/lib/hono";

interface ChatQueryProps {
  conversationId: string;
}

export function useGetConversationMessages({ conversationId }: ChatQueryProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [`chat-${conversationId}`],
      queryFn: async ({ pageParam }) => {
        const response = await client.api.conversations[
          ":conversationId"
        ].messages.$get({
          query: {
            cursor: pageParam,
          },
          param: {
            conversationId,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch conversation messages");
        }

        const { messages, nextCursor } = await response.json();

        const parsedMessages = messages.map(message => ({
          ...message,
          createdAt: new Date(message.createdAt),
          updatedAt: new Date(message.updatedAt),
        }));

        return { messages: parsedMessages, nextCursor };
      },
      initialPageParam: "",
      getNextPageParam: lastPage => lastPage?.nextCursor,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
}
