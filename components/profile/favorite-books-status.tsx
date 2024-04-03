"use client";

import { useEffect, useState } from "react";
import { useKey } from "react-use";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { useUserFavBooksByStatus } from "./use-favorite-books-status";
import { FavoriteBookStatus } from "@prisma/client";

import { Loader } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

type Props = {
  userId: string;
  userName: string;
};

export const FavoriteBooksStatus = ({ userId, userName }: Props) => {
  const [bookStatus, setBookStatus] = useState<FavoriteBookStatus | null>(null);
  const [showUserBooks, setShowUserBooks] = useState(false);

  useKey("Escape", () => setBookStatus(null), {}, [bookStatus]);

  const { data, isLoading, error } = useUserFavBooksByStatus({
    userId,
    status: bookStatus,
  });
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) {
      return;
    }
    let curr: FavoriteBookStatus = FavoriteBookStatus.WILL_READ;

    if (api.selectedScrollSnap() === 0) {
      curr = FavoriteBookStatus.WILL_READ;
    } else if (api.selectedScrollSnap() === 1) {
      curr = FavoriteBookStatus.READING;
    } else if (api.selectedScrollSnap() === 2) {
      curr = FavoriteBookStatus.FINISHED;
    }
    setBookStatus(curr);

    api.on("select", () => {
      if (api.selectedScrollSnap() === 0) {
        curr = FavoriteBookStatus.WILL_READ;
      } else if (api.selectedScrollSnap() === 1) {
        curr = FavoriteBookStatus.READING;
      } else if (api.selectedScrollSnap() === 2) {
        curr = FavoriteBookStatus.FINISHED;
      }
      setBookStatus(curr);
    });
  }, [api, bookStatus]);

  if (error) {
    return <div className="text-center text-red-500">An error occurred.</div>;
  }

  return (
    <div className={cn("px-2", showUserBooks && "h-[300px]")}>
      <div className="flex flex-col gap-y-4">
        <div className="w-full flex justify-center items-center">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
            }}
            className="max-w-[150px] sm:max-w-sm flex justify-center"
          >
            <CarouselContent className="m-auto">
              {Object.values(FavoriteBookStatus).map(status => (
                <CarouselItem
                  onClick={() => setShowUserBooks(!showUserBooks)}
                  key={status}
                  className={cn(
                    "w-full flex justify-center items-center py-2 mx-0 px-0 text-black dark:text-[#F4F4F5] bg-[#FFFFFF] dark:bg-[#27272A] rounded-md hover:cursor-pointer",
                    showUserBooks &&
                      bookStatus === status &&
                      "rounded-2xl bg-[#F4F4F5] dark:bg-[#18181B]"
                  )}
                >
                  <span className="text-sm sm:text-3xl font-semibold">
                    {status}
                  </span>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>

        {showUserBooks && (
          <div className="flex flex-col pl-4 space-y-4 my-4">
            <div className="text-lg sm:text-3xl text-primary font-semibold">
              {userName}&apos;s {bookStatus?.split("_").join(" ").toLowerCase()}{" "}
              books list
            </div>

            <ScrollArea className="h-[200px] w-full flex justify-between overflow-auto no-scrollbar">
              {isLoading && (
                <div className="flex justify-center items-center">
                  <Loader className="h-6 w-6 animate-spin" />
                </div>
              )}
              {data?.length === 0 && (
                <div className="flex justify-center items-center text-muted-foreground">
                  No books found.
                </div>
              )}

              {data?.map(({ book, favorite }, index) => (
                <Link key={index} href={`books/${book.id}`} className="group">
                  <div className="rounded-md border px-4 py-3 my-2 group-hover:bg-primary/10 transition-colors duration-200">
                    <div className="flex items-start gap-2">
                      <Image
                        src={book.volumeInfo.imageLinks?.thumbnail || ""}
                        alt={book.volumeInfo.title}
                        width={40}
                        height={30}
                        className="aspect-auto rounded-md"
                      />

                      <div className="flex flex-col">
                        <h4 className="text-sm sm:text-lg font-semibold text-primary">
                          {book.volumeInfo.title}
                        </h4>
                        <p className="text-xs leading-snug text-muted-foreground">
                          {book.volumeInfo.title}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </ScrollArea>
          </div>
        )}
      </div>
    </div>
  );
};
