"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import { Book } from "@/types";
import { MoreVertical, Star, Trash } from "lucide-react";
import { extractCategories } from "@/lib/book";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useModal } from "@/hooks/use-modal-store";

interface BookCardProps {
  book: Book;
  favBookId?: string;
}

const BookCard = ({ book, favBookId }: BookCardProps) => {
  const router = useRouter();
  const { onOpen } = useModal();
  const onBookClick = (bookId: string) => {
    router.push(`/books/${bookId}`);
  };
  const categories = extractCategories(book.volumeInfo.categories);

  return (
    <Card
      onClick={() => onBookClick(book.id)}
      key={book.id}
      className="cursor-pointer hover:opacity-80 transition-all"
    >
      <CardHeader className="relative aspect-square w-full h-48">
        <Image
          fill
          src={book.volumeInfo.imageLinks?.thumbnail || ""}
          alt={book.volumeInfo.title}
        />
      </CardHeader>
      <CardContent className="py-4 pl-2 pr-0">
        <div className="flex justify-between">
          <div className="flex flex-col space-y-3">
            <div className="relative flex justify-between items-center">
              <div className="mr-2">
                {categories?.map((category: string) => (
                  <Badge variant={"outline"} key={category}>
                    {category}
                  </Badge>
                ))}
              </div>
              {favBookId && (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <div
                      onClick={e => {
                        e.stopPropagation();
                      }}
                      className="absolute right-0 top-0 hover:opacity-30"
                    >
                      <MoreVertical className="w-6 h-6" />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={e => {
                        e.stopPropagation();
                        onOpen("removeFavBook", { bookId: book.id, favBookId });
                      }}
                      className="text-rose-600 px-3 py-2 text-sm cursor-pointer"
                    >
                      Remove
                      <Trash className="w-4 h-4 ml-auto" />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-md font-bold text-primary line-clamp-1">
                {book.volumeInfo?.title}
              </h2>
              {book.volumeInfo?.averageRating && (
                <div className="flex items-center gap-1 text-xs text-zinc-500 dark:text-zinc-400 font-bold">
                  ({book.volumeInfo?.averageRating})
                  <Star className="w-4 h-4" />
                </div>
              )}
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-3">
              {book.volumeInfo?.description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BookCard;
