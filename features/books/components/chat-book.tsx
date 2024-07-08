"use client";
import { usePathname, useRouter } from "next/navigation";

import BookAction from "@/components/book-action";

export interface ChatBookProps {
  bookId: string;
}

export default function ChatBook({ bookId }: ChatBookProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <BookAction
      title="Chat Now"
      description="You can start chatting with the book now."
      btnLabel="Start chatting"
      onClick={() => {
        sessionStorage.setItem("prevPath", pathname);
        router.push(`/book/${bookId}/conversation`);
      }}
    />
  );
}
