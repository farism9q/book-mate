"use client";
import { Conversation } from "@prisma/client";
import { Book } from "@/types/book";
import { InitialUserType } from "@/types/initial-user";

import ChatMessages from "./chat-messages";
import ChatInput from "./chat-input";

import { useChatProvider } from "@/components/providers/chat-provider";
import ChatHeader from "./chat-header";

interface Props {
  book: Book;
  user: InitialUserType;
  conversation: Conversation;
  bookChatCountsLimit: number;
  isSubscribed: boolean;
}

export const ChatPannel = ({
  book,
  user,
  conversation,
  bookChatCountsLimit,
  isSubscribed,
}: Props) => {
  const {
    conversation: sharedConversation,
    setConversation,
    book: sharedBook,
    setBook,
    user: sharedUser,
    setUser,
    bookChatLimit: sharedBookChatLimit,
    setBookChatLimit,
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

  if (!sharedBookChatLimit) {
    setBookChatLimit(bookChatCountsLimit);
  }

  return (
    <>
      <ChatHeader isSubscribed={isSubscribed} />
      <ChatMessages />
      <ChatInput />
    </>
  );
};
