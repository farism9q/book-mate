import { ChatMessage } from "@/features/conversation/types";
import { InitialUserType } from "@/types/initial-user";
import { Book } from "@/types/book";

import ChatItem from "./chat-item";
import { MessageFile } from "@prisma/client";

type Props = {
  messages: {
    chatMessage: ChatMessage;
    imagesPreview?: string[];
  }[];

  user: InitialUserType;
  book: Book;
  isStreaming: boolean;
};

export const ChatStream = ({ messages, user, book, isStreaming }: Props) => {
  const lastMessageIsUser =
    messages[messages.length - 1]?.chatMessage.role === "user";

  return (
    <div className="flex flex-col py-4 space-y-2 w-full">
      <ChatItem
        type={messages[0].chatMessage.role === "user" ? "user" : "chatgpt"}
        avatar={user.userProfileImage?.imageUrl || user.imageURL}
        imagesPreview={
          messages[0].chatMessage.role === "user" &&
          messages[0].imagesPreview !== undefined
            ? messages[0].imagesPreview
            : undefined
        }
        text={
          messages[0].chatMessage.role === "user"
            ? messages[0].chatMessage.content
            : messages[1]?.chatMessage.content || ""
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
          type={messages[1].chatMessage.role !== "user" ? "chatgpt" : "user"}
          avatar={"/chatgpt-logo.png"}
          question={
            messages[0].chatMessage.role === "user"
              ? messages[0].chatMessage.content
              : messages[1].chatMessage.content
          }
          text={messages[1].chatMessage.content || ""}
          bookTitle={book.volumeInfo.title}
          isChatStreaming={isStreaming}
          bookImageUrl={book.volumeInfo.imageLinks.thumbnail}
        />
      )}
    </div>
  );
};
