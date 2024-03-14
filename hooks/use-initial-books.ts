import { useQuery } from "@tanstack/react-query";

import { Category } from "@/constants";
import { getInitialBooks } from "@/lib/initial-books";

interface useInitialBooksProps {
  category: Category;
  currPage: number;
}

export function useInitialBooks({ category, currPage }: useInitialBooksProps) {
  const { data, status, isFetching } = useQuery({
    queryKey: [`${category}-books-${currPage}`],
    queryFn: () => getInitialBooks({ category, currPage }),
    staleTime: 1000 * 60 * 60,
  });

  return { data, status, isFetching };
}
