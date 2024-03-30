"use client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import qs from "query-string";
import axios from "axios";

import { useModal } from "@/hooks/use-modal-store";
import { extractCategories } from "@/lib/utils";
import { Book } from "@/types";
import { ErrorType } from "@/constants";

import { Card, CardContent, CardHeader } from "../ui/card";
import { Badge } from "../ui/badge";
import {
  Check,
  Heart,
  Loader,
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
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
} from "../ui/dropdown-menu";
import { toast } from "sonner";
import BookDescription from "./book-description";
import { FavoriteBookStatus } from "@prisma/client";
import { useState } from "react";
import { Separator } from "../ui/separator";

interface BookCardProps {
  book: Book;
  favBookId?: string;
  favBookStatus?: FavoriteBookStatus;
}

export const BookCard = ({ book, favBookId, favBookStatus }: BookCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { onOpen, data } = useModal();

  const onBookStatusChange = async (status: FavoriteBookStatus) => {
    if (status === favBookStatus) return;
    if (!favBookId) return;

    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: `/api/fav-book/${favBookId}`,
      });

      const response = await axios.patch(url, { status });

      if (response.data.status === FavoriteBookStatus.FINISHED) {
        const books =
          data.finishedBooks?.length === 0
            ? [book]
            : [book, ...(data.finishedBooks || [])];

        onOpen("finishBook", { finishedBooks: books });
      }

      toast.success("Book status updated");
      router.refresh();
    } catch (err: any) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const onBookClick = (bookId: string) => {
    router.push(`/books/${bookId}`);
  };

  const onAddBookAsFav = async (bookId: string) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/fav-book",
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
              <DropdownMenuTrigger
                disabled={isLoading}
                className={isLoading ? "outline-none" : ""}
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <div
                    onClick={e => {
                      e.stopPropagation();
                    }}
                    className="ml-auto hover:opacity-30"
                  >
                    <MoreVertical className="size-6 hover:border-[1px] border-slate-400 dark:border-slate-200" />
                  </div>
                )}
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
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger className="flex items-center">
                      <span className="uppercase">
                        {favBookStatus?.replace("_", " ")}
                      </span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {Object.values(FavoriteBookStatus).map(status => {
                          return (
                            <DropdownMenuItem
                              key={status}
                              onClick={e => {
                                e.stopPropagation();
                                onBookStatusChange(status);
                              }}
                              className="py-2 text-sm cursor-pointer"
                            >
                              {status.replace("_", " ")}
                              {favBookStatus === status && (
                                <Check className="w-4 h-4 ml-auto" />
                              )}
                            </DropdownMenuItem>
                          );
                        })}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                )}
                {favBookId && (
                  <>
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

                    <Separator className="h-[2px] my-[2px]" />

                    <DropdownMenuItem
                      onClick={e => {
                        e.stopPropagation();
                        onOpen("removeFavBook", {
                          bookId: book.id,
                          favBookId,
                        });
                      }}
                      className="text-rose-600 px-3 py-2 text-sm cursor-pointer"
                    >
                      Remove
                      <Trash className="w-4 h-4 ml-auto" />
                    </DropdownMenuItem>
                  </>
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

          <BookDescription
            description={book.volumeInfo.description}
            className="line-clamp-3"
          />
        </div>
      </CardContent>
    </Card>
  );
};
