import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

interface ChatQueryProps {
  conversationId?: string;
}

export function useChatQuery({ conversationId }: ChatQueryProps) {
  const fetchMessages = async ({ pageParam = undefined }) => {
    try {
      const url = qs.stringifyUrl(
        {
          url: `/api/book/chat/${conversationId}`,
          query: {
            cursor: pageParam,
          },
        },
        { skipNull: true }
      );

      const response = await fetch(url);
      return response.json(); // The fetched messages. (messages and nextCursor)
    } catch (error) {
      throw new Error("Something went wrong. Please try again.");
    }
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [`chat-${conversationId}`],
      queryFn: fetchMessages,
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
