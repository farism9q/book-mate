import { useEffect, useState } from "react";

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  messagesCount: number;
  loadMore: () => void;
  shouldLoadMore: boolean;
};

export function useChatScroll({
  bottomRef,
  chatRef,
  messagesCount,
  loadMore,
  shouldLoadMore,
}: ChatScrollProps) {
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const topDiv = chatRef.current;
    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;

      // This will trigger the loadMore function when the user scrolls to the top of the chat.
      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    topDiv?.addEventListener("scroll", handleScroll);

    return () => {
      topDiv?.removeEventListener("scroll", handleScroll);
    };
  }, [chatRef, shouldLoadMore, loadMore]);

  useEffect(() => {
    const topDiv = chatRef.current;
    const bottomDiv = bottomRef.current;
    const handleScroll = () => {
      if (!topDiv || !bottomDiv) {
        return;
      }

      // First mount, scroll to bottom
      if (bottomDiv && !hasInitialized) {
        setHasInitialized(true);
        return;
      }

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      // If distance from bottom is less than 100px, scroll to bottom
      return distanceFromBottom >= 100;
    };
    if (handleScroll()) {
      setTimeout(() => {
        bottomDiv?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [bottomRef, chatRef, messagesCount, hasInitialized]);
}
