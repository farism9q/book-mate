"use client";
import { Conversation, Message, User } from "@prisma/client";

import StartQuestions from "./start-questions";
import { Book } from "@/types";
import ChatItem from "./chat-item";
import { useChatQuery } from "@/hooks/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";
import { Fragment } from "react";

interface ChatMessagesProps {
  book: Book;
  user: User;
  conversation: Conversation | null;
}

const ChatMessages = ({ book, user, conversation }: ChatMessagesProps) => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({
      bookId: book.id,
      userId: user.id,
      conversationId: conversation?.id,
    });

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
    <div className="flex-1 overflow-y-auto no-scrollbar my-4 px-10 md:px-20">
      {!conversation?.id && <StartQuestions book={book} userId={user.id} />}

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
        <div className="flex flex-col-reverse mt-auto">
          {data?.pages.map((group, idx) => (
            <Fragment key={idx}>
              {group.items.map((message: Message) => (
                <div key={message.id} className="flex flex-col py-4">
                  <ChatItem
                    type="user"
                    avatar={user.imageURL}
                    text={message.userQuestion}
                  />
                  <ChatItem
                    type="chatgpt"
                    avatar={"/chatgpt-logo.png"}
                    text={message.chatGPTResponse}
                  />
                </div>
              ))}
            </Fragment>
          ))}
        </div>
      }
    </div>
  );
};

export default ChatMessages;