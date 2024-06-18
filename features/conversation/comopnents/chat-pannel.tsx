"use client";

import { useGetConversationMessages } from "@/features/conversation/api/use-get-conversation-messages";
import { useCreateConversationMessage } from "@/features/conversation/api/use-create-conversation-message";
import { useGetConversationLimit } from "@/features/conversation/api/use-get-conversation-limit";
import ChatMessages from "@/features/conversation/comopnents/chat-messages";
import ChatInput from "@/features/conversation/comopnents/chat-input";
import ChatHeader from "@/features/conversation/comopnents/chat-header";
import { ChatLoader } from "@/features/conversation/comopnents/chat-loader";
import { formatMessages } from "@/features/conversation/utils";

import { useState } from "react";
import { StreamableValue, readStreamableValue } from "ai/rsc";
import { useModal } from "@/hooks/use-modal-store";

import { askQuestion } from "@/actions/openai-chat";

import { ChatMessage } from "@/features/conversation/types";
import { Conversation } from "@prisma/client";
import { Book } from "@/types/book";
import { InitialUserType } from "@/types/initial-user";

import { toast } from "sonner";

import { ErrorType, CHAT_LIMIT_PER_BOOK } from "@/constants";

interface Props {
  book: Book;
  user: InitialUserType;
  conversation: Conversation;
  isSubscribed: boolean;
}

export const ChatPannel = ({
  book,
  user,
  conversation,
  isSubscribed,
}: Props) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setStreaming] = useState(false);
  const { onOpen } = useModal();

  const { data } = useGetConversationMessages({
    conversationId: conversation.id,
  });

  const { mutate: saveUserChatgptConversationMessage } =
    useCreateConversationMessage({
      conversationId: conversation.id,
    });

  const { data: bookChatLimit, isLoading: bookChatLimitLoading } =
    useGetConversationLimit({
      conversationId: conversation.id,
    });

  if (bookChatLimitLoading) {
    return <ChatLoader />;
  }

  if (bookChatLimit === undefined) {
    return null;
  }

  const conversationMessages =
    data?.pages?.map(group => group?.messages?.map(message => message))[0] ||
    [];

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

    if (bookChatLimit >= CHAT_LIMIT_PER_BOOK && !isSubscribed) {
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

        return;
      }

      const streamableResult = result as StreamableValue<string, any>;

      for await (const content of readStreamableValue(streamableResult)) {
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

      saveUserChatgptConversationMessage({
        question,
        text: chatgptResponse,
      });
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setMessages([]);
    } finally {
      setStreaming(false);
    }
  };

  return (
    <>
      <ChatHeader
        book={book}
        bookChatLimit={bookChatLimit}
        isSubscribed={isSubscribed}
      />
      <ChatMessages
        book={book}
        user={user}
        conversation={conversation}
        onSubmitMessage={onSubmitMessage}
        isStreaming={isStreaming}
        messages={messages}
      />
      <ChatInput
        onSubmitMessage={onSubmitMessage}
        isStreaming={isStreaming}
        isSubscribed={isSubscribed}
        bookChatLimit={bookChatLimit}
      />
    </>
  );
};
