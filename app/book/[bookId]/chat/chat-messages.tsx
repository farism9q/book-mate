"use client";
import { Conversation, Message, User } from "@prisma/client";

import StartQuestions from "./start-questions";
import { Book } from "@/types/book";
import ChatItem from "./chat-item";
import { useChatQuery } from "@/hooks/use-chat-query";
import { ArrowDown, Loader2, ServerCrash } from "lucide-react";
import { ElementRef, Fragment, useRef } from "react";
import { useChatScroll } from "@/hooks/use-chat-scroll";

interface ChatMessagesProps {
  book: Book;
  user: User;
  conversation: Conversation | null;
  onSendMessage: (message: string) => void;
  isPending: boolean;
}

const ChatMessages = ({
  book,
  user,
  conversation,
  onSendMessage,
  isPending,
}: ChatMessagesProps) => {
  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);
  const scrollRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      bookId: book.id,
      userId: user.userClerkId,
      conversationId: conversation?.id,
    });

  const { showScrollButton } = useChatScroll({
    bottomRef,
    chatRef,
    scrollRef,
    messagesCount: data?.pages[0]?.items?.length || 0,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
  });

  const onScrollButton = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div
      ref={chatRef}
      className="flex-1 relative overflow-y-auto no-scrollbar px-4 max-w-5xl mx-auto my-4"
    >
      {data?.pages[0]?.items?.length === 0 && (
        <StartQuestions
          userId={user.userClerkId}
          book={book}
          onSendMessage={onSendMessage}
          isPending={isPending}
        />
      )}
      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="h-6 w-6 text-zinc-500 animate-spin my-4" />
          ) : (
            <button
              onClick={() => fetchNextPage()}
              className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs my-4 dark:hover:text-zinc-300 transition"
            >
              Load previous messages
            </button>
          )}
        </div>
      )}

      {
        <div
          ref={scrollRef}
          className="flex flex-col-reverse mt-auto w-full h-full overflow-y-auto no-scrollbar"
        >
          <div ref={bottomRef} />
          {data?.pages.map((group, idx) => (
            <Fragment key={idx}>
              {group.items.map((message: Message, messageIdx: number) => (
                <div key={message.id} className="flex flex-col py-4 space-y-2">
                  <ChatItem
                    type="user"
                    avatar={user.imageURL}
                    text={message.userQuestion}
                  />
                  <ChatItem
                    type="chatgpt"
                    avatar={"/chatgpt-logo.png"}
                    question={message.userQuestion}
                    text={message.chatGPTResponse}
                    bookTitle={book.volumeInfo.title}
                    bookImageUrl={book.volumeInfo.imageLinks.thumbnail}
                  />
                </div>
              ))}
            </Fragment>
          ))}
          {showScrollButton && (
            <div
              className="absolute bottom-2 right-4 bg-zinc-900/20 dark:bg-zinc-700/40
            rounded-full flex justify-center items-center p-2 hover:scale-110 transition-all"
            >
              <button
                onClick={() => {
                  onScrollButton();
                }}
              >
                <ArrowDown className="h-6 w-6 text-slate-50 dark:text-slate-100" />
              </button>
            </div>
          )}
        </div>
      }
    </div>
  );
};

export default ChatMessages;
