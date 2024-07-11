import { useGetUserReviewsInfinite } from "@/features/review/api/use-get-user-reviews";

import { ElementRef, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useModal } from "@/hooks/use-modal-store";

import { extractCategories } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Edit, Loader2, Star } from "lucide-react";

const REVIEWS_BATCH_SIZE = 5;

type Props = {
  tabClicked: boolean;
  whenScrolledTop: () => void;
};

export const Reviews = ({ tabClicked, whenScrolledTop }: Props) => {
  const router = useRouter();
  const { onOpen } = useModal();

  const bottomRef = useRef<ElementRef<"div">>(null);
  const scrollRef = useRef<ElementRef<"div">>(null);

  const { data, fetchNextPage, isFetchingNextPage, hasNextPage, status } =
    useGetUserReviewsInfinite({
      batchSize: REVIEWS_BATCH_SIZE,
    });

  useEffect(() => {
    if (!tabClicked) {
      return;
    }

    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    whenScrolledTop();
  }, [tabClicked]);

  useEffect(() => {
    if (!hasNextPage) {
      return;
    }

    const observer = new IntersectionObserver(entries => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        fetchNextPage();
      }
    });

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }
  }, [bottomRef.current, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (status === "loading") {
    return (
      <div className="divide-y-2">
        {Array.from({ length: 3 }).map((_, idx) => (
          <LoadingSkeleton key={idx} />
        ))}
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-60 flex flex-col items-center justify-center h-full">
        <p className="text-lg font-semibold">Something went wrong</p>
        <p className="text-gray-500">Please try again</p>
        <Button
          className="mt-4"
          onClick={() => {
            fetchNextPage();
          }}
        >
          Try again
        </Button>
      </div>
    );
  }

  const books = data?.pages?.map(group => group.books).flat() || [];
  const reviews = data?.pages?.map(group => group.reviews).flat() || [];

  if (reviews.length === 0) {
    return (
      <div className="min-h-60 flex flex-col items-center justify-center h-full">
        <p className="text-lg font-semibold">No reviews yet</p>
        <p className="text-gray-500">Start reviewing books now!</p>
        <Button
          className="mt-4"
          onClick={() => {
            router.push("/books");
          }}
        >
          Browse Books
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div
        ref={scrollRef}
        className="h-[520px] md:h-[595px] rounded-md overflow-y-auto no-scrollbar"
      >
        <div className="space-y-6">
          {reviews.map((review, idx) => {
            const book = books[idx];
            const categories = extractCategories(book.volumeInfo.categories);
            const nbStars = review.rating;

            return (
              <Card key={review.id}>
                <CardHeader className="flex flex-row gap-x-4">
                  <Image
                    width={100}
                    height={75}
                    className="rounded-t-md aspect-auto object-cover"
                    priority
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={book.volumeInfo.title}
                  />
                  <div className="flex flex-col gap-y-1">
                    <CardTitle
                      className="cursor-pointer hover:underline w-fit"
                      onClick={() => {
                        router.push(`/books/${book.id}`);
                      }}
                    >
                      <div className="text-lg font-semibold overflow-auto">
                        {book.volumeInfo.title}
                      </div>
                    </CardTitle>

                    <CardDescription className="flex flex-col gap-y-2 text-sm font-light italic">
                      {book.volumeInfo.authors?.join(", ")}
                    </CardDescription>
                    <div className="pt-6 flex items-center space-x-1 text-primary-500 dark:text-primary-400">
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        <TooltipProvider>
                          {categories.slice(0, 5).map((category: string) => (
                            <Tooltip key={category}>
                              <TooltipTrigger>
                                <Badge
                                  key={category}
                                  variant={"outline"}
                                  className="text-center text-[8px] md:text-[12px] 
                                             bg-gradient-to-b border
                                            from-zinc-500/70 via-zinc-500/60 to-zinc-500/30 text-zinc-900 border-zinc-200/70 hover:bg-zinc-100
                                            dark:from-zinc-700/70 dark:via-zinc-700/60 dark:to-zinc-700/30 dark:text-zinc-500 dark:border-zinc-500/70 dark:hover:bg-zinc-500/20"
                                >
                                  {category.toUpperCase()}
                                </Badge>
                              </TooltipTrigger>

                              <TooltipContent>{category}</TooltipContent>
                            </Tooltip>
                          ))}
                        </TooltipProvider>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent
                  className="
                  bg-white dark:bg-zinc-900/80 rounded-md border-t border-gray-200 dark:border-zinc-900/80
                  shadow-md transition-shadow duration-300 hover:shadow-lg p-4 mx-4 mb-4
                  text-gray-600 dark:text-gray-400 text-sm font-light italic
                  "
                >
                  {review.review}

                  <button
                    onClick={() => {
                      onOpen("reviewBook", {
                        reviewBook: {
                          books: [book],
                          previousReview: {
                            reviewId: review.id,
                            rating: review.rating,
                            review: review.review,
                          },
                        },
                      });
                    }}
                    className="flex items-center mt-4 ml-auto"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                </CardContent>
                <CardFooter>
                  <div className="ml-auto flex items-center space-x-1 text-primary-500 dark:text-primary-400">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        size={24}
                        className={`${
                          nbStars >= index + 1
                            ? "text-amber-400 fill-amber-400"
                            : "text-gray-500"
                        }`}
                      />
                    ))}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
        <div className="flex items-center justify-center w-full py-4">
          {hasNextPage && <div className="size-4" ref={bottomRef} />}
          {isFetchingNextPage && hasNextPage && (
            <div className="flex items-center justify-center w-full">
              <span className="mr-2 text-muted-foreground text-sm">
                Loading...
              </span>
              <Loader2 className="size-5 text-zinc-500 animate-spin" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => {
  return (
    <div className="space-y-6 w-full p-2">
      <div className="flex flex-row gap-x-4">
        <Skeleton className="w-20 h-24" />

        <div className="flex flex-col gap-y-1">
          <Skeleton className="w-64 h-4 rounded-sm" />
          <Skeleton className="mt-2 w-52 h-2" />

          <div className="pt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-5 w-28" />
          </div>
        </div>
      </div>
      <Skeleton className="h-32 w-full" />
    </div>
  );
};
