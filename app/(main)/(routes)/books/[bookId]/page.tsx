"use client";
import Image from "next/image";
import { Staatliches } from "next/font/google";

import { useGetBooks } from "@/features/books/api/use-get-books";
import { useGetFavoriteBooks } from "@/features/favorite-books/api/use-get-favorite-books";
import { useGetSubscription } from "@/features/subscription/api/use-get-subscription";
import { useGetUserLimit } from "@/features/user-limit/api/use-get-user-limit";
import { useCreateFavBook } from "@/features/favorite-books/api/use-create-fav-book";

import { cn } from "@/lib/utils";
import { extractCategories } from "@/lib/utils";
import { ErrorType, USER_FREE_LIMIT } from "@/constants";

import { Star } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import AddFavBook from "@/app/(main)/(routes)/books/[bookId]/add-fav-book";
import ChatBook from "@/features/books/components/chat-book";
import BookDescription from "@/components/book-description";
import UserFreeLimit from "@/components/user-free-limit";
import ForYouBooks from "@/components/for-you-books";
import { toast } from "sonner";

import { useModal } from "@/hooks/use-modal-store";
import { useRouter } from "next/navigation";

interface BookDetailPageProps {
  params: {
    bookId: string;
  };
}

const font = Staatliches({ subsets: ["latin"], weight: "400" });

const BookTitlePage = ({ params }: BookDetailPageProps) => {
  const { bookId } = params;
  const { onOpen } = useModal();
  const router = useRouter();
  const { data: booksData, isLoading: isLoadingBook } = useGetBooks({
    booksId: [bookId],
    queryKey: [bookId],
  });
  const { data: favBooks, isLoading: isLoadingFavBooks } = useGetFavoriteBooks(
    {}
  );

  const { data: isSubscribed } = useGetSubscription();

  const { data: userLimit } = useGetUserLimit();

  const {
    mutate: createFavBook,
    isPending: isCreatingFavBook,
    status,
  } = useCreateFavBook();

  const onClick = async () => {
    toast.loading("Adding to favorite");
    createFavBook(
      { bookId },
      {
        onSuccess(data) {
          if ("type" in data && data.type === ErrorType.ALREADY_FAV) {
            toast.error(data.message);
            router.push(`/books/${bookId}`);
            return;
          }
          if ("type" in data && data.type === ErrorType.UPGRADE_PLAN) {
            toast.error(data.message);
            onOpen("upgradePlan");
            return;
          }

          toast.success("Added to favorite");
        },
        onSettled() {
          toast.dismiss();
        },
      }
    );
  };

  if (isLoadingBook || isLoadingFavBooks) {
    return <LoadingSkeleton />;
  }

  const book = booksData ? booksData[0] : null;

  if (!book || !favBooks) {
    return <div>Something went wrong</div>;
  }

  const userFav = favBooks.favoriteBooks.find(
    favBook => favBook.bookId === book.id
  );

  const categories = extractCategories(book.volumeInfo.categories);

  const dontShowBookActions =
    userLimit === USER_FREE_LIMIT && isSubscribed === false && !userFav;

  return (
    <>
      <title>{`${book.volumeInfo.title}`}</title>
      <meta name="description" content={`${book.volumeInfo.title} book.`} />
      <div className="py-12 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative aspect-square w-full h-full">
            <Image
              fill
              src={book.volumeInfo.imageLinks?.thumbnail || ""}
              alt={book.volumeInfo.title}
              className="rounded-lg"
            />
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <h1
              className={cn("text-3xl font-bold text-primary", font.className)}
            >
              {book.volumeInfo.title}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400">
              By &nbsp;
              <span className="text-md text-primary">
                {book.volumeInfo.authors?.join(", ")}
              </span>
            </p>
            {book.volumeInfo.averageRating && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  <span className="text-xs font-bold">
                    {book.volumeInfo.averageRating}
                  </span>
                </div>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  {book.volumeInfo.ratingsCount} ratings
                </span>
              </div>
            )}
            <span className="text-xs text-zinc-500 dark:text-zinc-200">
              {book.volumeInfo.pageCount} pages
            </span>

            <Separator />
            <div className="grid grid-cols-3 gap-2">
              {Array.from(categories).map((category: string) => (
                <Badge variant={"secondary"} key={category}>
                  {category.toUpperCase()}
                </Badge>
              ))}
            </div>

            <BookDescription description={book.volumeInfo.description} />

            {dontShowBookActions ? (
              <UserFreeLimit userLimitCount={userLimit} />
            ) : !userFav ? (
              <AddFavBook
                onClick={onClick}
                isCreatingFavBook={isCreatingFavBook}
              />
            ) : (
              <ChatBook bookId={book.id} />
            )}
          </div>
          <div className="flex flex-col space-y-4 bg-primary/20 border-2 border-primary rounded-lg p-3">
            <h3 className="uppercase text-primary text-3xl">Product details</h3>
            <div className="flex items-center justify-between">
              <span className="uppercase text-zinc-500 dark:text-zinc-400">
                Published Date
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {book.volumeInfo.publishedDate}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="uppercase text-zinc-500 dark:text-zinc-400">
                Publisher
              </span>
              <span className="text-zinc-500 dark:text-zinc-400">
                {book.volumeInfo.publisher}
              </span>
            </div>
          </div>
        </div>
        {status === "success" && <ForYouBooks sample />}
      </div>
    </>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="py-12 px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Skeleton className="relative aspect-square w-full h-full" />
        <div className="flex flex-col justify-center space-y-4">
          <Skeleton className="w-1/2 h-6" />
          <Skeleton className="w-1/3 h-4" />
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Skeleton className="w-1/3 h-4" />
            </div>
          </div>
          <Skeleton className="w-1/3 h-4" />

          <Separator />
          <Skeleton className="w-full h-16" />
          <Skeleton className="w-full h-64" />
          <Skeleton className="w-full h-32" />
        </div>
      </div>
    </div>
  );
};

export default BookTitlePage;
