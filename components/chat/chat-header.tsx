"use client";
import { Book } from "@/types";
import { EntityAvatar } from "../entity-avatar";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface ChatHeaderProps {
  book: Book;
}

const ChatHeader = ({ book }: ChatHeaderProps) => {
  const router = useRouter();

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
          <button
            onClick={e => {
              e.stopPropagation();
              router.back();
            }}
            className="ml-2 rounded-md hover:bg-zinc-300/90 dark:hover:bg-[#333]"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center pl-4 py-2">
            <EntityAvatar
              src={book.volumeInfo.imageLinks.thumbnail}
              alt={book.volumeInfo.title}
              className="w-10 h-10 md:w-12 md:h-12"
            />
            <h1 className="text-sm md:text-2xl font-bold pl-2 line-clamp-1">
              {book.volumeInfo.title}
            </h1>
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

          <ScrollArea className="text-xs h-[300px] md:text-sm text-zinc-500 dark:text-zinc-400 pt-2">
            {book.volumeInfo.description}
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Veritatis
            ipsam consequatur, minus nisi, eveniet animi porro in officia amet
            fuga eaque, qui praesentium quisquam? Et itaque repudiandae
            veritatis rem laboriosam inventore ratione voluptas sunt quis cumque
            tempore ducimus at expedita, nobis laudantium accusamus fugit quia
            dolor dolorem? Vel, ut repellat. Veritatis ipsam consequatur, minus
            nisi, eveniet animi porro in officia amet fuga eaque, qui
            praesentium quisquam? Et itaque repudiandae veritatis rem laboriosam
            inventore ratione voluptas sunt quis cumque tempore ducimus at
            expedita, nobis laudantium accusamus fugit quia dolor dolorem? Vel,
            ut repellat.
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatHeader;
