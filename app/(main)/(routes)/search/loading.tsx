import BookCardSkeleton from "@/components/book/book-card-skeleton";
import RoutePage from "@/components/route-page";
import { SearchBooksAction } from "@/components/search-books-action";

export default function SearchBooksLoading() {
  return (
    <RoutePage title="">
      <SearchBooksAction />
      <div className="grid mx-8 sm:grid-cols-2 md:grid-cols-3 pt-24 gap-6">
        {Array.from({ length: 12 }).map((_, idx) => (
          <BookCardSkeleton key={idx} />
        ))}
      </div>
    </RoutePage>
  );
}
