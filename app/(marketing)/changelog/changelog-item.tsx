"use client";


import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";

import { cn, truncateTxt } from "@/lib/utils";
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
import { useState } from "react";

const categoryColor: Record<ChangelogCategory, string> = {
  "IMPROVEMENT": "bg-amber-500",
  "NEW_FEATURE": "bg-green-500",
  "BUG_FIX": "bg-rose-500",
  "USER_EXPERIENCE_ENHANCEMENT": "bg-blue-500",
  "OTHER": "bg-gray-500",
};

type Props = {
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
  const truncatedDescription = truncateTxt({
    text: description,
    nbChars: 250,
  });

  const [extendedDescription, setExtendedDescription] = useState(false);
  return (
    <div className="flex flex-col mx-6">
      <div
        className={cn(
          "group relative flex flex-col items-center space-y-2 border-zinc-800 border-t border-l border-r p-2 rounded-t-lg w-fit text-sm/6 text-zinc-400 dark:hover:text-zinc-100 hover:text-zinc-900 hover:shadow-glow"
        )}
      >
        <h2 className="text-2xl md:text-3xl font-bold">{format(date, "PP")}</h2>

        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-primary/20 via-primary/80 animate-ping transition-opacity duration-1000 group-hover:opacity-40" />
      </div>
      <div className="flex flex-col justify-between rounded-lg border border-zinc-800 rounded-s-none p-2 h-full">
        <h1 className="text-3xl md:text-4xl font-semibold text-white">
          {title}
        </h1>
        <div className="flex items-center gap-x-4 gap-y-2 flex-1 flex-wrap py-4">
          {categories.map(category => (
            <div key={category} className="flex items-center gap-x-1">
              <div
                className={cn(
                  "w-3 h-3 rounded-full",
                  categoryColor[category as ChangelogCategory]
                )}
              />
              <p className="text-xs text-white">
                {category.replaceAll("_", " ")}
              </p>
            </div>
          ))}
        </div>

        <div onClick={() => setExtendedDescription(!extendedDescription)}>
          <Markdown
            rehypePlugins={[rehypeRaw]}
            components={{
              div: ({ node, ...props }) => (
                <div className="space-y-2" {...props} />
              ),
              h4: ({ node, ...props }) => (
                <h4
                  className="text-xl font-semibold text-slate-200"
                  {...props}
                />
              ),

              p: ({ node, ...props }) => (
                <p className="text-[#bcbec4]" {...props} />
              ),
              li: ({ node, ...props }) => (
                <li className="text-[#bcbec4]" {...props} />
              ),
              strong: ({ node, ...props }) => (
                <div className="w-full relative">
                  <div className="absolute w-[2px] h-full bg-zinc-500" />
                  <strong className="ml-2 text-[#7b7c80]" {...props} />
                </div>
              ),
            }}
          >
            {extendedDescription ? description : truncatedDescription.text}
          </Markdown>
        </div>
        <div onClick={() => setExtendedDescription(!extendedDescription)}></div>

        <div className="flex items-center justify-center pt-12 pb-4">
          <Carousel className="max-w-lg">
            <CarouselContent>
              {images.map((imgSrc, index) => (
                <CarouselItem
                  key={index}
                  className="flex justify-center items-center"
                >
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
                <CarouselPrevious className="bg-transparent text-[#c3cde4]" />
                <CarouselNext className="bg-transparent text-[#c3cde4]" />
              </>
            )}
          </Carousel>
        </div>

        <Footer
          changelogId={changelogId}
          reaction={reaction}
          feedback={feedback}
        />

        {nbLikes > 0 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-lg text-[#636d82]">
              {nbLikes} {nbLikes === 1 ? "like" : "likes"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
