"use client";

import { SearchBooksAction } from "@/components/search-books-action";
import CustomPagination from "@/components/custom-pagination";
import { useSearchParams } from "next/navigation";
import { useInitialBooks } from "@/hooks/use-initial-books";
import { Category } from "@/constants";
import BookCardSkeleton from "@/components/book/book-card-skeleton";
import { BookCard } from "@/components/book/book-card";
import { Book } from "@/types/book";
import { useModal } from "@/hooks/use-modal-store";
import { useEffect, useState } from "react";
import { subscriptionType } from "@/types/subscription";

const InitialPage = () => {
  const searchParams = useSearchParams();
  const { onOpen } = useModal();
  const [hasOpenedModal, setHasOpenedModal] = useState(false);

  const cameFromSubscription = searchParams.get("subscription");

  const category =
    (searchParams.get("category") as Category) || Category.HEALTH;
  const page = searchParams.get("page") || 0;

  const { data, status, isFetching } = useInitialBooks({
    category,
    currPage: Number(page),
  });

  useEffect(() => {
    if (
      (cameFromSubscription === subscriptionType.SUBSCRIBE.toLowerCase() ||
        cameFromSubscription === subscriptionType.UPDATE.toLowerCase()) &&
      !hasOpenedModal
    ) {
      onOpen("subscriptionSuccess");
      setHasOpenedModal(true);
    }
  }, [cameFromSubscription, hasOpenedModal, onOpen]);

  return (
    <div className="flex flex-col w-full overflow-y-auto no-scrollbar px-4">
      <div className="space-y-8">
        <div className="mt-12 px-2">
          <SearchBooksAction isFetching={isFetching} type="initial" />
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
