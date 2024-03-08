"use client";

import { useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";
import { usePathname, useSearchParams } from "next/navigation";

const CustomPagination = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = searchParams.get("page") || "1";

  // Get a new searchParams string by merging the current
  // searchParams with a provided key/value pair
  const queryString = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString());

      // if (value !== "0") {
      params.set("page", value);
      // }

      return params.toString();
    },
    [searchParams]
  );
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          {page !== "1" && (
            <PaginationPrevious
              href={pathname + "?" + queryString(+page - 1 + "")}
            />
          )}
        </PaginationItem>
        {/* <PaginationItem>
          {page !== "1" ? (
            <PaginationLink href={pathname + "?" + queryString(+page - 1 + "")}>
              {page}
            </PaginationLink>
          ) : (
            page
          )}
        </PaginationItem> */}
        <PaginationItem>
          <p className="text-lg text-primary font-bold">{page}</p>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href={pathname + "?" + queryString(+page + 1 + "")} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default CustomPagination;
