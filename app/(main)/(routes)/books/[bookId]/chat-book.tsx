"use client";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export interface ChatBookProps {
  bookId: string;
}

export default function ChatBook({ bookId }: ChatBookProps) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <div className="flex flex-col primary space-y-4 p-3">
      <h3 className="uppercase text-white text-center text-3xl">Chat Now</h3>
      <div className="flex flex-col items-center justify-center space-y-6">
        <p className="text-zinc-100">
          You can start chatting with the book now.
        </p>
        <Button
          variant={"primary"}
          size={"lg"}
          onClick={() => {
            sessionStorage.setItem("prevPath", pathname);
            router.push(`/book/${bookId}/conversation`);
          }}
        >
          Start Chatting
        </Button>
      </div>
    </div>
  );
}
