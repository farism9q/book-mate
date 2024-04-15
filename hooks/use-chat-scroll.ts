import { useEffect, useState } from "react";

const SCROLL_THRESHOLD = 200;

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  scrollRef: React.RefObject<HTMLDivElement>;
  y: number;
  isMobile: boolean;
  messagesCount: number;
  loadMore: () => void;
  shouldLoadMore: boolean;
};

export function useChatScroll({
  bottomRef,
  chatRef,
  scrollRef,
  y,
  isMobile,
  messagesCount,
  loadMore,
  shouldLoadMore,
}: ChatScrollProps) {
  const [hasInitialized, setHasInitialized] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    if (y * -1 > SCROLL_THRESHOLD) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  }, [y, bottomRef, hasInitialized, scrollRef, isMobile]);

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
  return { showScrollButton };
}
