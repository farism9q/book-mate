import qs from "query-string";
import { useInfiniteQuery } from "@tanstack/react-query";

interface ChatQueryProps {
  bookId: string;
  userId: string;
  conversationId?: string;
}

export function useChatQuery({
  bookId,
  userId,
  conversationId,
}: ChatQueryProps) {
  const fetchMessages = async ({ pageParam = undefined }) => {
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
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: [`chat-${conversationId}`],
      queryFn: fetchMessages,
      getNextPageParam: lastPage => lastPage.nextCursor,
      refetchInterval: 1000,
    });

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  };
}
