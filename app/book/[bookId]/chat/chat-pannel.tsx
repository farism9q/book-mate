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
    bookChatLimit: sharedBookChatLimit,
    setBookChatLimit,
    setBook,
    book: sharedBook,
    setConversation,
    conversation: sharedConversation,
    isSubscribed: sharedIsSubscribed,
    setSubscribed,
  } = useChatProvider();

  if (!sharedBook) {
    setBook(book);
  }

  if (!sharedConversation) {
    setConversation(conversation);
  }

  if (!sharedBookChatLimit) {
    setBookChatLimit(bookChatCountsLimit);
  }

  if (sharedIsSubscribed === null) {
    setSubscribed(isSubscribed);
  }

  return (
    <>
      <ChatHeader isSubscribed={isSubscribed} book={book} />
      <ChatMessages book={book} user={user} conversation={conversation} />
      <ChatInput />
    </>
  );
};
