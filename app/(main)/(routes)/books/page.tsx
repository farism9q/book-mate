"use client";

import { SearchBooksAction } from "@/components/search-books-action";
import CustomPagination from "@/components/custom-pagination";
import { useSearchParams } from "next/navigation";
import { useInitialBooks } from "@/hooks/use-initial-books";
import { useState } from "react";
import { Category } from "@/constants";
import BookCardSkeleton from "@/components/book/book-card-skeleton";
import { BookCard } from "@/components/book/book-card";
import { Book } from "@/types/book";

const InitialPage = () => {
  const [category, setCategory] = useState<Category>(Category.HEALTH);

  const handleCategoryOnChange = (category: Category) => {
    setCategory(category);
  };

  const searchParams = useSearchParams();
  const currPage =
    searchParams.get("page") !== null ? Number(searchParams.get("page")) : 0;
  const { data, status, isFetching } = useInitialBooks({
    category,
    currPage: currPage || 0,
  });
  return (
    <div className="flex flex-col w-full overflow-y-auto no-scrollbar px-4">
      <div className="space-y-8">
        <div className="mt-12 px-2">
          <SearchBooksAction
            isFetching={isFetching}
            type="initial"
            onCategoryChange={handleCategoryOnChange}
          />
        </div>

        {/* Is fetching */}
        {isFetching && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
              {Array.from({ length: 6 }).map((_, idx) => (
                <BookCardSkeleton key={idx} />
              ))}
            </div>
          </div>
        )}

        {/* error */}
        {status === "error" && <div>Error fetching books</div>}

        {/* Else (Book have fetched successfully) */}
        {data && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 px-2">
              {data?.map((book: Book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
            <div className="py-2">
              <CustomPagination />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default InitialPage;
