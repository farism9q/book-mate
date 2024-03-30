"use client";
import qs from "query-string";
import axios from "axios";
import { toast } from "sonner";

import { Book, BookInfoForChatGPT } from "@/types";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";
import { Conversation, User } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { ErrorType } from "@/constants";
import { useModal } from "@/hooks/use-modal-store";

interface Props {
  book: Book;
  user: User;
  conversation: Conversation;
}

export const ChatPannel = ({ book, user, conversation }: Props) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { onOpen } = useModal();

  const onSendMessage = (question: string) => {
    startTransition(async () => {
      try {
        const url = qs.stringifyUrl({
          url: `/api/book/chat`,
          query: {
            userId: user.userClerkId,
          },
        });

        await axios.post(url, {
          question,
          book: {
            id: book.id,
            title: book.volumeInfo.title,
            publisher: book.volumeInfo.publisher,
            authors: book.volumeInfo.authors,
            publishedDate: book.volumeInfo.publishedDate,
          } as BookInfoForChatGPT,
        });

        router.refresh();
      } catch (error: any) {
        if (
          error?.response?.status === 403 &&
          error.response.data?.type === ErrorType.UPGRADE_PLAN
        ) {
          toast.error(error.response.data.message);
          onOpen("upgradePlan");
        } else {
          toast.error("Failed to send question");
        }
      }
    });
  };

  return (
    <>
      <ChatMessages
        book={book}
        user={user}
        conversation={conversation}
        onSendMessage={onSendMessage}
        isPending={isPending}
      />
      <ChatInput
        userId={user.userClerkId}
        book={book}
        onSendMessage={onSendMessage}
        isPending={isPending}
      />
    </>
  );
};
