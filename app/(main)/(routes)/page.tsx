"use client";

import { SearchBooksAction } from "@/components/search-books-action";
import InitialBooks from "@/components/initial-books";
import CustomPagination from "@/components/custom-pagination";

const InitialPage = () => {
  return (
    <div className="flex flex-col w-full overflow-y-auto no-scrollbar px-4">
      <div className="mt-12 px-4 md:w-[600px] md:mx-auto">
        <SearchBooksAction />
      </div>

      <InitialBooks />

      <div className="py-2">
        <CustomPagination />
      </div>
    </div>
  );
};

export default InitialPage;
