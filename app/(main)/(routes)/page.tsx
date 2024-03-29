"use client";
import { Staatliches } from "next/font/google";

import { cn } from "@/lib/utils";
import { SearchBooksAction } from "@/components/search-books-action";
import InitialBooks from "@/components/initial-books";
import CustomPagination from "@/components/custom-pagination";

const font = Staatliches({ subsets: ["latin"], weight: "400" });

const InitialPage = () => {
  return (
    <div className="flex flex-col overflow-y-auto no-scrollbar">
      <div className="relative h-[500px] w-full bg-[url('/home-image.jpg')] bg-no-repeat bg-center bg-fixed bg-cover">
        <div className="bg-black bg-opacity-60 h-full w-full">
          <div className="flex flex-col justify-center items-center h-full space-y-6">
            <div className="flex flex-col items-center justify-center space-y-2">
              <p className="uppercase text-zinc-200">
                Discover the world of books
              </p>
              <h1
                className={cn(
                  "uppercase text-primary text-4xl md:text-6xl",
                  font.className
                )}
              >
                Find your next read
              </h1>
            </div>

            <div className="flex flex-col justify-center items-center gap-4">
              <p className="uppercase text-center text-zinc-200">
                Explore a vast collection of books and dive into new worlds
              </p>
              <SearchBooksAction />
            </div>
          </div>
        </div>
      </div>
      <InitialBooks />
      <div className="py-2">
        <CustomPagination />
      </div>
    </div>
  );
};

export default InitialPage;
