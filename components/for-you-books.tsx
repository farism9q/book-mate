"use client";

import { useGetUserRecommendedBooks } from "@/hooks/use-get-user-recommended-books";
import Image from "next/image";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState, useCallback, memo } from "react";
import { Book } from "@/types/book";
import { UserBookPreferences } from "@prisma/client";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

type LocalUserBookPreferences = Pick<
  UserBookPreferences,
  "id" | "userId" | "genres"
> & {
  createdAt: string;
  updatedAt: string;
};

type ForYouBooksProps = {
  highRatedBooks: Book[];
  favoriteBooks: Book[];
  genrePrefrences: LocalUserBookPreferences;
  sample?: boolean;
};

const ForYouBooks = memo(function ForYouBooks({
  highRatedBooks,
  favoriteBooks,
  genrePrefrences,
  sample = false,
}: ForYouBooksProps) {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const {
    data: books,
    isLoading,
    error,
  } = useGetUserRecommendedBooks({
    page,
    highRatedBooks,
    favoriteBooks,
    genrePrefrences,
  });

  const handlePrevPage = useCallback(() => {
    setPage(p => Math.max(1, p - 1));
  }, []);

  const handleNextPage = useCallback(() => {
    setPage(p => p + 1);
  }, []);

  const onBookClick = (book: Book) => {
    router.push(`/books/${book.id}`);
  };

  if (isLoading) return <SkeletonLoading />;

  if (error) return <div>Error</div>;

  if (!books) return null;

  if (sample) {
    return (
      <div className="px-4 py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold">Recommended for You</h2>
          <div className="mt-4 flex justify-center">
            <button onClick={() => router.push("/recommended")}>
              View All Books
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {books.slice(0, 6).map(book => (
            <motion.div
              key={book.id}
              className="relative group"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative aspect-[2/3] rounded-md overflow-hidden">
                <Image
                  src={book.volumeInfo.imageLinks?.thumbnail || "/no-image.png"}
                  alt={book.volumeInfo.title}
                  fill
                  className="object-cover"
                />
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onBookClick(book);
                  }}
                  className="z-50 absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300">
                  <div className="absolute bottom-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="font-semibold text-sm">
                      {book.volumeInfo.title}
                    </h3>
                    <p className="text-xs text-gray-300">
                      {book.volumeInfo.authors?.join(", ")}
                    </p>
                    {book.volumeInfo.averageRating && (
                      <div className="flex items-center mt-2">
                        <span className="text-yellow-400">★</span>
                        <span className="text-xs ml-1">
                          {book.volumeInfo.averageRating}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Recommended for You</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {books?.map(book => (
          <motion.div
            key={book.id}
            className="relative group cursor-pointer"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative aspect-[2/3] rounded-md overflow-hidden">
              <Image
                src={book.volumeInfo.imageLinks?.thumbnail || "/no-image.png"}
                alt={book.volumeInfo.title}
                fill
                className="object-cover"
              />
              <button
                onClick={e => {
                  e.stopPropagation();
                  onBookClick(book);
                }}
                className="z-50 absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300">
                <div className="absolute bottom-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="font-semibold text-sm">
                    {book.volumeInfo.title}
                  </h3>
                  <p className="text-xs text-gray-300">
                    {book.volumeInfo.authors?.join(", ")}
                  </p>
                  {book.volumeInfo.averageRating && (
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-400">★</span>
                      <span className="text-xs ml-1">
                        {book.volumeInfo.averageRating}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 flex justify-center items-center gap-4">
        <Button
          variant="outline"
          onClick={handlePrevPage}
          disabled={page === 1 || isLoading}
        >
          Previous
        </Button>
        <span className="text-sm">Page {page}</span>
        <Button variant="outline" onClick={handleNextPage}>
          Next
        </Button>
      </div>
    </div>
  );
});

function SkeletonLoading() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {[...Array(6)].map((_, index) => (
        <div key={index} className="aspect-[2/3]">
          <Skeleton className="w-full h-full rounded-md" />
        </div>
      ))}
    </div>
  );
}

export default ForYouBooks;
