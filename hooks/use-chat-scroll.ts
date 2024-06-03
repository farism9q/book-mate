import { useEffect, useState } from "react";
import { useMedia } from "react-use";

const SCROLL_THRESHOLD = 200;
const BOTTOM_CLIENT_Y_THRESHOLD = 614.4000244140625; // This the inital value of the bottom div (clientY)

type ChatScrollProps = {
  chatRef: React.RefObject<HTMLDivElement>;
  bottomRef: React.RefObject<HTMLDivElement>;
  scrollRef: React.RefObject<HTMLDivElement>;
  messagesCount: number;
  chatMessagesLength: number | undefined;
  loadMore: () => void;
  shouldLoadMore: boolean;
};

export function useChatScroll({
  bottomRef,
  chatRef,
  scrollRef,
  messagesCount,
  chatMessagesLength,
  loadMore,
  shouldLoadMore,
}: ChatScrollProps) {
  const [hasInitialized, setHasInitialized] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const isMobile = useMedia("(max-width: 1366px)", false);

  useEffect(() => {
    if (chatRef.current && chatMessagesLength && chatMessagesLength > 0) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatRef, chatMessagesLength]);

  useEffect(() => {
    const bottomDiv = bottomRef.current;

    if (!bottomDiv || !isMobile) {
      return;
    }

    const handleScroll = () => {
      const y = bottomDiv.getBoundingClientRect().y;
      if (bottomRef.current && scrollRef.current) {
        // If distance from bottom is more than 200px, show the scroll button
        const shouldShowButton =
          y - BOTTOM_CLIENT_Y_THRESHOLD >= SCROLL_THRESHOLD;

        setShowScrollButton(shouldShowButton);
      }
    };

    const currentScrollRef = scrollRef.current;
    currentScrollRef?.addEventListener("scroll", handleScroll);

    // Clean up event listener on unmount
    return () => {
      currentScrollRef?.removeEventListener("scroll", handleScroll);
    };
  }, [bottomRef, scrollRef, isMobile, messagesCount]);

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
    const topDiv = chatRef?.current;
    const bottomDiv = bottomRef?.current;
    const shouldAutoScroll = () => {
      if (!topDiv || !bottomDiv) {
        return;
      }

      // // First mount, scroll to bottom
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      // If distance from bottom is less than 100px, scroll to bottom
      return distanceFromBottom >= 100;
    };
    if (shouldAutoScroll()) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100);
    }
  }, [bottomRef, chatRef, messagesCount, hasInitialized]);
  return { showScrollButton };
}
