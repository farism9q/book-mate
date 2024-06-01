import { ChatMessage } from "@/types/chat";
import { InitialUserType } from "@/types/initial-user";
import { Book } from "@/types/book";

import ChatItem from "./chat-item";

type Props = {
  messages: ChatMessage[];
  user: InitialUserType;
  book: Book;
  isStreaming: boolean;
};

export const ChatStream = ({ messages, user, book, isStreaming }: Props) => {
  const lastMessageIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div className="flex flex-col py-4 space-y-2 w-full">
      <ChatItem
        type={messages[0].role === "user" ? "user" : "chatgpt"}
        avatar={user.userProfileImage?.imageUrl || user.imageURL}
        text={
          messages[0].role === "user"
            ? messages[0].content
            : messages[1]?.content || ""
        }
      />

      {lastMessageIsUser && (
        <ChatItem
          type={"chatgpt"}
          avatar={"/chatgpt-logo.png"}
          text={"Thinking..."}
          isChatgptThinkg={lastMessageIsUser}
        />
      )}
      {messages[1] && (
        <ChatItem
          type={messages[1].role !== "user" ? "chatgpt" : "user"}
          avatar={"/chatgpt-logo.png"}
          question={
            messages[0].role === "user"
              ? messages[0].content
              : messages[1].content
          }
          text={messages[1].content || ""}
          bookTitle={book.volumeInfo.title}
          isChatStreaming={isStreaming}
          bookImageUrl={book.volumeInfo.imageLinks.thumbnail}
        />
      )}
    </div>
  );
};
