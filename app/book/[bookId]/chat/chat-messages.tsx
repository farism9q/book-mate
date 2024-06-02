"use client";

import { ElementRef, Fragment, useRef } from "react";

import { Conversation, Message } from "@prisma/client";

import StartQuestions from "./start-questions";
import ChatItem from "./chat-item";
import { ArrowDown, Loader2, ServerCrash } from "lucide-react";
import { useChatScroll } from "@/hooks/use-chat-scroll";

import { ChatStream } from "./chat-stream";
import { useChatQuery } from "@/hooks/use-chat-query";
import { useChatProvider } from "@/components/providers/chat-provider";
import { Book } from "@/types/book";
import { InitialUserType } from "@/types/initial-user";

type Props = {
  book: Book;
  user: InitialUserType;
  conversation: Conversation;
};

const ChatMessages = ({ book, conversation, user }: Props) => {
  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);
  const scrollRef = useRef<ElementRef<"div">>(null);

  const {
    messages: chatMessages,
    onSubmitMessage,
    isStreaming,
  } = useChatProvider();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      conversationId: conversation?.id,
    });

  const messagesCount = data?.pages[0]?.messages?.length || 0;

  const { showScrollButton } = useChatScroll({
    bottomRef,
    chatRef,
    scrollRef,
    messagesCount,
    chatMessagesLength: chatMessages.length,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
  });

  const onScrollButton = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isPending = isStreaming || chatMessages.length > 0;

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
      className="flex-1 relative overflow-y-auto no-scrollbar px-4 my-4"
    >
      {book && user && (
        <div
          ref={scrollRef}
          className="flex flex-col-reverse mt-auto lg:w-[1024px] mx-auto h-full overflow-y-auto no-scrollbar"
        >
          <div ref={bottomRef} />
          {chatMessages.length > 0 && (
            <ChatStream
              book={book}
              user={user}
              messages={chatMessages}
              isStreaming={isStreaming}
            />
          )}

          {data?.pages[0]?.messages?.length === 0 && !isPending && (
            <StartQuestions onSubmitMessage={onSubmitMessage} />
          )}

          {data?.pages?.map((group, idx) => (
            <Fragment key={idx}>
              {group.messages?.map((message: Message) => (
                <div key={message.id} className="flex flex-col py-4 space-y-2">
                  <ChatItem
                    type="user"
                    avatar={user.userProfileImage?.imageUrl || user.imageURL}
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
          {hasNextPage && (
            <div className="flex justify-center py-2">
              {isFetchingNextPage ? (
                <Loader2 className="h-6 w-6 text-zinc-500 animate-spin" />
              ) : (
                <button
                  onClick={() => fetchNextPage()}
                  className="text-zinc-500 hover:text-zinc-600 dark:text-zinc-400 text-xs dark:hover:text-zinc-300 transition"
                >
                  Load previous messages
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatMessages;
