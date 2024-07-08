"use client";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { CHAT_LIMIT_PER_BOOK } from "@/constants";
import { Book } from "@/types/book";

import { ChevronLeft } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { EntityAvatar } from "@/components/entity-avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import BookDescription from "@/components/book-description";
import { Badge } from "@/components/ui/badge";
import { ActionTooltip } from "@/components/action-tooltip";

interface ChatHeaderProps {
  book: Book;
  bookChatLimit: number;
  isSubscribed: boolean;
}

const ChatHeader = ({ book, bookChatLimit, isSubscribed }: ChatHeaderProps) => {
  const router = useRouter();
  const { onOpen } = useModal();

  const onBackClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    // Get the previous path
    const prevPath = sessionStorage.getItem("prevPath");
    if (prevPath) {
      router.push(prevPath);
    } else {
      router.push("/favorite-books");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="flex items-center gap-2 border border-slate-200 bg-slate-100 dark:bg-gray-900 dark:border-gray-800">
          <Button
            variant={"ghost"}
            onClick={onBackClick}
            className="ml-2 p-2 rounded-md hover:bg-slate-200 dark:hover:bg-gray-800 transition-colors"
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
          </div>
          {!isSubscribed && bookChatLimit !== undefined && (
            <ActionTooltip
              label={`${
                CHAT_LIMIT_PER_BOOK - bookChatLimit
              } chats left for this book`}
            >
              <div className="min-w-fit pr-2">
                <Badge
                  variant={"premium"}
                  className="text-sm md:text-2xl line-clamp-none"
                  onClick={e => {
                    e.stopPropagation();
                    onOpen("upgradePlan");
                  }}
                >
                  <p className="text-white">{bookChatLimit} / 5</p>
                </Badge>
              </div>
            </ActionTooltip>
          )}
        </div>
      </SheetTrigger>
      <SheetContent side={"left"} className="z-[100]">
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

          <ScrollArea className="h-[300px] border rounded-md p-2 mt-2">
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
