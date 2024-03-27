"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Book } from "@/types";

import { EntityAvatar } from "../entity-avatar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft } from "lucide-react";
import { Button } from "../ui/button";
import BookDescription from "../book/book-description";
import { Badge } from "../ui/badge";
import { useModal } from "@/hooks/use-modal-store";
import { ActionTooltip } from "../action-tooltip";
import { CHAT_LIMIT_PER_BOOK } from "@/constants";

interface ChatHeaderProps {
  book: Book;
  bookChatCountsLimit: number;
  isSubscribed: boolean;
}

const ChatHeader = ({
  book,
  bookChatCountsLimit,
  isSubscribed,
}: ChatHeaderProps) => {
  const router = useRouter();
  const { onOpen } = useModal();

  const [isMoutned, setIsMoutned] = useState(false);

  useEffect(() => {
    setIsMoutned(true);
  }, []);

  if (!isMoutned) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger>
        <div className="flex items-center gap-2 bg-zinc-200/90 dark:bg-[#212121]">
          <Button
            variant={"ghost"}
            onClick={e => {
              e.stopPropagation();
              router.back();
            }}
            className="ml-2 p-2 rounded-md hover:bg-zinc-300/90 dark:hover:bg-[#333]"
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center pl-2 py-2 mr-10 w-full">
            <EntityAvatar
              src={book.volumeInfo.imageLinks.thumbnail}
              alt={book.volumeInfo.title}
              className="w-10 h-10 md:w-12 md:h-12"
            />
            <h1 className="text-sm md:text-2xl font-bold pl-2 line-clamp-1">
              {book.volumeInfo.title}
            </h1>
            {!isSubscribed && (
              <ActionTooltip
                label={`${
                  CHAT_LIMIT_PER_BOOK - bookChatCountsLimit
                } chats left for this book`}
              >
                <div className="min-w-fit pl-2 ml-auto">
                  <Badge
                    variant={"premium"}
                    className="text-sm md:text-2xl line-clamp-none"
                    onClick={e => {
                      e.stopPropagation();
                      onOpen("upgradePlan");
                    }}
                  >
                    <p className="text-white">{bookChatCountsLimit} / 5</p>
                  </Badge>
                </div>
              </ActionTooltip>
            )}
          </div>
        </div>
      </SheetTrigger>
      <SheetContent side={"left"}>
        <div className="flex flex-col items-center">
          <EntityAvatar
            src={book.volumeInfo.imageLinks.thumbnail}
            alt={book.volumeInfo.title}
            className="w-20 h-20 md:w-24 md:h-24"
          />
          <h1 className="text-lg md:text-2xl text-center font-bold pt-2 line-clamp-2">
            {book.volumeInfo.title}
          </h1>
          <p className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 pt-1">
            {book.volumeInfo.authors.join(", ")}
          </p>

          <div className="flex items-center space-x-2 pt-2">
            <span className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
              {book.volumeInfo.pageCount} pages
            </span>
            <span className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
              {book.volumeInfo.publishedDate}
            </span>

            <span className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400">
              {book.volumeInfo.publisher}
            </span>
          </div>

          <ScrollArea className="h-[300px] border-2 border-slate-200 rounded-md p-2 mt-2">
            <BookDescription
              description={book.volumeInfo.description}
              className="text-zinc-500 dark:text-zinc-400"
            />
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatHeader;
