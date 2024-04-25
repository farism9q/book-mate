"use client";

import { cn } from "@/lib/utils";
import { Footer } from "./footer";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ChangelogCategory } from "@prisma/client";
import { format } from "date-fns";
import { useMedia } from "react-use";

const categoryColor: Record<ChangelogCategory, string> = {
  "IMPROVEMENT": "bg-amber-500",
  "NEW_FEATURE": "bg-green-500",
  "BUG_FIX": "bg-rose-500",
  "OTHER": "bg-gray-500",
};

type Props = {
  userId: string | null;
  changelogId: string;
  date: Date;
  title: string;
  categories: ChangelogCategory[];
  description: string;
  images: string[];
  reaction?: boolean | null;
  feedback?: string | null;
  nbLikes: number;
};

export const ChangelogItem = ({
  userId,
  changelogId,
  title,
  categories,
  description,
  images,
  date,
  reaction,
  feedback,
  nbLikes,
}: Props) => {
  const isMobile = useMedia("(max-width: 750px)", false);
  return (
    <div className="flex flex-col mx-6">
      <div
        className={cn(
          "group relative flex flex-col items-center space-y-2 border-t border-l border-r p-2 rounded-t-lg w-fit text-sm/6 text-zinc-400 dark:hover:text-zinc-100 hover:text-zinc-900 hover:shadow-glow"
        )}
      >
        <h2 className="text-2xl md:text-3xl font-bold">{format(date, "PP")}</h2>

        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-primary/20 via-primary/80 animate-ping transition-opacity duration-1000 group-hover:opacity-40" />
      </div>
      <div className="flex flex-col justify-between rounded-lg border rounded-s-none p-2 h-full">
        <h1 className="text-3xl md:text-5xl font-semibold">{title}</h1>
        <div className="flex items-center gap-x-4 flex-1 py-4">
          {categories.map(category => (
            <div key={category} className="flex items-center gap-x-1">
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  categoryColor[category as ChangelogCategory]
                )}
              />
              <p className="text-xs">{category.replace("_", " ")}</p>
            </div>
          ))}
        </div>

        <p className="text-lg pt-4 line-clamp-5 text-muted-foreground">
          {description}
        </p>

        <div className="flex items-center justify-center pt-12 pb-4">
          <Carousel className="max-w-lg">
            <CarouselContent>
              {images.map((imgSrc, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <Image
                      src={imgSrc}
                      alt={title}
                      width={500}
                      height={550}
                      quality={100}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {!isMobile && (
              <>
                <CarouselPrevious />
                <CarouselNext />
              </>
            )}
          </Carousel>
        </div>

        {userId && (
          <Footer
            changelogId={changelogId}
            reaction={reaction}
            feedback={feedback}
          />
        )}

        {nbLikes > 0 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-lg text-muted-foreground">
              {nbLikes} {nbLikes === 1 ? "like" : "likes"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
