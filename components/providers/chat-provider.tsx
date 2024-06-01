"use client";
import React, { createContext, useContext } from "react";

import { useState } from "react";
import { StreamableValue, readStreamableValue } from "ai/rsc";
import { toast } from "sonner";

import { formatMessages } from "@/lib/utils";
import { useChatQuery } from "@/hooks/use-chat-query";
import { saveUserChatgptConversationMessage } from "@/actions/conversation";
import { askQuestion } from "@/actions/openai-chat";
import { ChatMessage } from "@/types/chat";

import { ErrorType, CHAT_LIMIT_PER_BOOK } from "@/constants";
import { useModal } from "@/hooks/use-modal-store";
import { QueryClient } from "@tanstack/react-query";
import { Conversation } from "@prisma/client";
import { Book } from "@/types/book";
import { Message } from "postcss";
import { InitialUserType } from "@/types/initial-user";

const ChatContext = createContext({
  setConversation: (conversation: Conversation) => {},
  conversation: null as Conversation | null,
  setBook: (book: Book) => {},
  book: null as Book | null,
  setUser: (user: InitialUserType) => {},
  user: null as InitialUserType | null,
  bookChatLimit: 0,
  setBookChatLimit: (limit: number) => {},
  messages: [] as ChatMessage[],
  setMessages: (messages: ChatMessage[]) => {},
  setStreaming: (isStreaming: boolean) => {},
  isStreaming: false,
  onSubmitMessage: (question: string) => {},
});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [book, setBook] = useState<Book | null>(null);
  const [user, setUser] = useState<InitialUserType | null>(null);
  const [bookChatLimit, setBookChatLimit] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setStreaming] = useState(false);

  const { onOpen } = useModal();
  const queryClient = new QueryClient();

  const { data } = useChatQuery({
    conversationId: conversation?.id,
  });

  const conversationMessages =
    data?.pages.map(group =>
      group.messages.map((message: Message) => message)
    )[0] || [];

  const isLastMessageSaved =
    messages.length > 0 &&
    conversationMessages &&
    conversationMessages.at(0)?.userQuestion === messages[0]?.content;

  if (isLastMessageSaved) {
    setMessages([]);
  }

  const formattedPreviousMessages = formatMessages(conversationMessages);

  const onSubmitMessage = async (question: string) => {
    if (!conversation || !book) {
      return;
    }

    if (bookChatLimit >= CHAT_LIMIT_PER_BOOK) {
      onOpen("upgradePlan");
      toast.error("Upgrade your plan to send more questions.");
      return;
    }

    setStreaming(true);

    const userMessage: ChatMessage = {
      role: "user",
      content: question,
    };

    setMessages([userMessage]);
    setBookChatLimit(prev => {
      return prev + 1 > CHAT_LIMIT_PER_BOOK ? prev : prev + 1;
    });
    let chatgptResponse = "";

    try {
      const result = (await askQuestion({
        book,
        previousChats: formattedPreviousMessages,
        question,
        conversationId: conversation.id,
      })) as StreamableValue<string, any> | { message: string; type: string };

      if ("type" in result && result.type === ErrorType.UPGRADE_PLAN) {
        toast.error(result.message);
        onOpen("upgradePlan");
        setMessages([]);
        setStreaming(false);
        setBookChatLimit(prev => {
          return prev - 1;
        });

        return;
      }

      for await (const content of readStreamableValue(result)) {
        if (content) {
          chatgptResponse = content;
        }

        setMessages(msgs => [
          userMessage,
          {
            role: "system",
            content: content as string,
          },
        ]);
      }

      setStreaming(false);

      await saveUserChatgptConversationMessage({
        conversationId: conversation.id,
        question,
        text: chatgptResponse,
      });
      queryClient.invalidateQueries({ queryKey: [`chat-${conversation.id}`] });
    } catch (error) {
      toast.error("Something went wrong. Please try again.");

      setBookChatLimit(prev => {
        return prev - 1;
      });

      setMessages([]);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        setConversation,
        conversation,
        setBook,
        book,
        setBookChatLimit,
        bookChatLimit,
        setUser,
        user,
        setStreaming,
        isStreaming,
        setMessages,
        messages,
        onSubmitMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatProvider = () => {
  const context = useContext(ChatContext);

  if (!context) {
    throw new Error("useChatProvider must be used within a ChatProvider");
  }

  return context;
};
