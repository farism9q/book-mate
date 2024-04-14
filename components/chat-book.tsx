import Link from "next/link";

import { Button } from "./ui/button";

export interface ChatBookProps {
  bookId: string;
}

export default function ChatBook({ bookId }: ChatBookProps) {
  return (
    <div className="flex flex-col space-y-4 premium border-2 border-black rounded-lg p-3">
      <h3 className="uppercase text-white text-center text-3xl">Chat Now</h3>
      <div className="flex flex-col items-center justify-center space-y-6">
        <p className="text-zinc-100">
          You can start chatting with the book now.
        </p>
        <Link href={`/book/${bookId}/chat`}>
          <Button variant={"premium"}>Chat</Button>
        </Link>
      </div>
    </div>
  );
}
