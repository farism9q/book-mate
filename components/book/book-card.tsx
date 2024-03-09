"use client";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader } from "../ui/card";
import Image from "next/image";
import { Badge } from "../ui/badge";
import { ActionTooltip } from "../action-tooltip";
import { Book } from "@/types";
import { Star } from "lucide-react";
import { CategoriesColors } from "@/constants";

interface BookCardProps {
  book: Book;
}

const BookCard = ({ book }: BookCardProps) => {
  const router = useRouter();
  const onBookClick = (bookId: string) => {
    router.push(`/books/${bookId}`);
  };

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
      <CardContent className="py-4 pl-2">
        <div className="flex justify-between">
          <div className="flex flex-col space-y-3">
            <div>
              {book.volumeInfo?.categories?.map(cateegory => (
                <Badge className={CategoriesColors[cateegory]} key={cateegory}>
                  {cateegory}
                </Badge>
              ))}
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
