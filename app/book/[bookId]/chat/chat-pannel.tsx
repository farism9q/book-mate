import { Conversation } from "@prisma/client";
import { Book } from "@/types/book";
import { InitialUserType } from "@/types/initial-user";

import ChatMessages from "./chat-messages";
import ChatInput from "./chat-input";

import { useChatProvider } from "@/components/providers/chat-provider";

interface Props {
  book: Book;
  user: InitialUserType;
  conversation: Conversation;
}

export const ChatPannel = ({ book, user, conversation }: Props) => {
  const {
    conversation: sharedConversation,
    setConversation,
    book: sharedBook,
    setBook,
    user: sharedUser,
    setUser,
  } = useChatProvider();

  if (!sharedConversation) {
    setConversation(conversation);
  }

  if (!sharedBook) {
    setBook(book);
  }

  if (!sharedUser) {
    setUser(user);
  }

  return (
    <>
      <ChatMessages />

      <ChatInput />
    </>
  );
};
