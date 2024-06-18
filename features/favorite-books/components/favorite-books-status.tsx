"use client";

import { useGetFavoriteBooks } from "@/features/favorite-books/api/use-get-favorite-books";

import { useEffect, useState } from "react";
import { useKey } from "react-use";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { FavoriteBookStatus } from "@prisma/client";

import { Loader } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type Props = {
  userName: string;
};

export const FavoriteBooksStatus = ({ userName }: Props) => {
  const [bookStatus, setBookStatus] = useState<FavoriteBookStatus | undefined>(
    undefined
  );
  const [showUserBooks, setShowUserBooks] = useState(false);

  useKey("Escape", () => setBookStatus(undefined), {}, [bookStatus]);

  const { data, isLoading, error } = useGetFavoriteBooks({
    filter: bookStatus,
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

  const books = data?.books || [];

  return (
    <div className={cn("px-2", showUserBooks && "h-[300px]")}>
      <div className="flex flex-col gap-y-4">
        <div className="w-full flex justify-center items-center">
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
            }}
            className="max-w-[150px] sm:max-w-sm flex justify-center transition-all duration-200"
          >
            <CarouselContent className="m-auto">
              {Object.values(FavoriteBookStatus).map(status => (
                <CarouselItem
                  onClick={() => setShowUserBooks(!showUserBooks)}
                  key={status}
                  className={cn(
                    "w-full flex justify-center items-center py-2 mx-0 px-0 rounded-md border-2 border-b-8 text-zinc-700 dark:text-zinc-200 bg-primary/30 dark:bg-primary/10 hover:dark:bg-primary/20 border-primary/30 dark:border-primary/10 hover:cursor-pointer hover:bg-primary/20 transition-all duration-200",
                    showUserBooks && bookStatus === status && "bg-primary/30",
                    showUserBooks && "border-2"
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
              {userName}&apos;s {` "`}
              {bookStatus?.split("_").join(" ").toLowerCase()}
              {`" `}
              books list
            </div>

            <ScrollArea className="h-[200px] w-full flex justify-between overflow-auto no-scrollbar">
              {isLoading && (
                <div className="flex justify-center items-center">
                  <Loader className="h-6 w-6 animate-spin" />
                </div>
              )}
              {books?.length === 0 && (
                <div className="flex justify-center items-center text-muted-foreground">
                  No books found.
                </div>
              )}

              {books?.map(({ id, volumeInfo }) => (
                <Link key={id} href={`books/${id}`} className="group">
                  <div className="rounded-md border px-4 py-3 my-2 group-hover:bg-primary/10 transition-colors duration-200">
                    <div className="flex items-start gap-2">
                      <Image
                        src={volumeInfo.imageLinks?.thumbnail || ""}
                        alt={volumeInfo.title}
                        width={40}
                        height={30}
                        className="aspect-auto rounded-md"
                      />

                      <div className="flex flex-col">
                        <h4 className="text-sm sm:text-lg font-semibold text-primary">
                          {volumeInfo.title}
                        </h4>

                        <p className="text-xs leading-snug text-muted-foreground">
                          {volumeInfo.title}
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
