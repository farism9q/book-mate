"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import qs from "query-string";
import axios from "axios";

import { useModal } from "@/hooks/use-modal-store";
import { extractCategories } from "@/lib/book";
import { Book } from "@/types";
import { ErrorType } from "@/constants";

import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Heart,
  MessageSquareMore,
  MoreVertical,
  Star,
  Trash,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { toast } from "sonner";

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

  const onAddBookAsFav = async (bookId: string) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/add-fav-book",
      });

      toast.promise(axios.post(url, { bookId }), {
        loading: "Adding to favorite",
        success(data) {
          router.push(`/books/${book.id}/chat`);
          router.refresh();
          return "Added to favorite";
        },
        error(error) {
          if (
            error?.response?.status === 403 &&
            error.response.data?.type === ErrorType.ALREADY_FAV
          ) {
            router.push(`/books/${book.id}`);
            router.refresh();
            return "Already added as favorite";
          }
          if (
            error?.response?.status === 403 &&
            error.response.data?.type === ErrorType.UPGRADE_PLAN
          ) {
            onOpen("upgradePlan");
            return "You need to upgrade";
          }

          return "Something went wrong";
        },
      });
    } catch (err: any) {
      if (
        err.response.data?.type !== ErrorType.ALREADY_FAV &&
        err.response.data?.type !== ErrorType.UPGRADE_PLAN
      ) {
        toast.error("Something went wrong");
      }
    }
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
      <CardContent className="px-2">
        {
          <div className="flex flex-row-reverse py-2 items-start">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div
                  onClick={e => {
                    e.stopPropagation();
                  }}
                  className="ml-auto hover:opacity-30"
                >
                  <MoreVertical className="size-5 hover:border-[1px] border-slate-400 dark:border-slate-200" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="absolute right-0 top-0 z-10 bg-white dark:bg-zinc-800 shadow-lg rounded-md py-2 w-40">
                {!favBookId && (
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      onAddBookAsFav(book.id);
                    }}
                    className="px-3 py-2 text-sm cursor-pointer"
                  >
                    Add as Favorite
                    <Heart className="w-4 h-4 ml-auto" />
                  </DropdownMenuItem>
                )}
                {favBookId && (
                  <DropdownMenuItem
                    onClick={e => {
                      e.stopPropagation();
                      router.push(`/books/${book.id}/chat`);
                    }}
                    className="px-3 py-2 text-sm cursor-pointer"
                  >
                    Chat
                    <MessageSquareMore className="w-4 h-4 ml-auto" />
                  </DropdownMenuItem>
                )}
                {favBookId && (
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
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-1 items-center w-full">
                {categories?.map((category: string) => {
                  return (
                    <Badge variant={"outline"} key={category}>
                      {category}
                    </Badge>
                  );
                })}
              </div>
            )}
          </div>
        }

        <div className="flex flex-col space-y-3">
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
      </CardContent>
    </Card>
  );
};

export default BookCard;
