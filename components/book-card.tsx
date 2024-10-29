"use client";
import { useCreateFavBook } from "@/features/favorite-books/api/use-create-fav-book";
import { useEditFavBook } from "@/features/favorite-books/api/use-edit-fav-book";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

import { extractCategories } from "@/lib/utils";
import { FavoriteBookStatus } from "@prisma/client";
import { Book } from "@/types/book";
import { ErrorType } from "@/constants";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import BookDescription from "@/components/book-description";
import { Separator } from "@/components/ui/separator";

interface BookCardProps {
  book: Book;
  favBookId?: string;
  favBookStatus?: FavoriteBookStatus;
}

export const BookCard = ({ book, favBookId, favBookStatus }: BookCardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { onOpen, data } = useModal();

  const { mutate: createFavBook } = useCreateFavBook();

  const { mutate: editFavBookStatus, isPending: editFavBookStatusLoading } =
    useEditFavBook();

  const onBookStatusChange = async (status: FavoriteBookStatus) => {
    if (status === favBookStatus) return;
    if (!favBookId) return;

    editFavBookStatus(
      {
        favBookId,
        status,
      },
      {
        onSuccess({ updatedFavBook }) {
          if (updatedFavBook.status === FavoriteBookStatus.FINISHED) {
            const books =
              data.reviewBook?.books?.length === 0
                ? [book]
                : [book, ...(data.reviewBook?.books || [])];

            onOpen("reviewBook", { reviewBook: { books } });
          }

          toast.success("Book status updated");
        },
      }
    );
  };

  const onAddBookAsFav = async (bookId: string) => {
    toast.loading("Adding to favorite");
    createFavBook(
      { bookId },
      {
        onSuccess(data) {
          if ("type" in data && data.type === ErrorType.ALREADY_FAV) {
            toast.error(data.message);
            router.push(`/books/${book.id}`);
            return;
          }
          if ("type" in data && data.type === ErrorType.UPGRADE_PLAN) {
            toast.error(data.message);
            onOpen("upgradePlan");
            return;
          }

          onChatClick(bookId);
          toast.success("Added to favorite");
        },
        onSettled() {
          toast.dismiss();
        },
      }
    );
  };

  const onBookClick = (bookId: string) => {
    router.push(`/books/${bookId}`);
  };

  const onChatClick = (bookId: string) => {
    sessionStorage.setItem("prevPath", pathname);
    router.push(`/book/${bookId}/conversation`);
  };

  const categories = extractCategories(book.volumeInfo.categories);

  return (
    <Card key={book.id}>
      <CardHeader className="relative aspect-square w-full h-48">
        <Image
          fill
          sizes="100% 100%"
          className="rounded-t-md"
          priority
          src={book.volumeInfo.imageLinks?.thumbnail || ""}
          alt={book.volumeInfo.title}
        />
      </CardHeader>
      <CardContent
        onClick={() => onBookClick(book.id)}
        className="px-2 cursor-pointer hover:opacity-80 transition-all"
      >
        {
          <div className="flex flex-row-reverse py-2 items-start">
            <DropdownMenu>
              <DropdownMenuTrigger
                disabled={editFavBookStatusLoading}
                className={editFavBookStatusLoading ? "outline-none" : ""}
              >
                {editFavBookStatusLoading ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <div
                    onClick={e => {
                      e.stopPropagation();
                    }}
                    className="hover:opacity-30 hover:bg-neutral-200 hover:dark:bg-neutral-700 rounded-md py-1"
                  >
                    <MoreVertical className="size-6" />
                  </div>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent className="absolute right-0 top-0 z-10 bg-white dark:bg-black shadow-lg rounded-md py-2 w-40">
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
                    <DropdownMenuSubTrigger
                      onClick={e => {
                        e.stopPropagation();
                      }}
                      className="flex items-center"
                    >
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
                        onChatClick(book.id);
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
