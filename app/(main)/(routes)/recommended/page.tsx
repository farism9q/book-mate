"use client";

import ForYouBooks from "@/components/for-you-books";

const RecommendedBooksPage = () => {
  return (
    <div className="flex flex-col w-full overflow-y-auto no-scrollbar px-4">
      <div className="space-y-8">
        <ForYouBooks />
      </div>
    </div>
  );
};

export default RecommendedBooksPage;
