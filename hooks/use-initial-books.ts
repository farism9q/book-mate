import { useQuery } from "@tanstack/react-query";

import { Category } from "@/constants";
import { getInitialBooks } from "@/lib/initial-books";

interface useInitialBooksProps {
  category: Category;
}

export function useInitialBooks({ category }: useInitialBooksProps) {
  console.log("category", category);
  const { data, status, isFetching } = useQuery({
    queryKey: [`${category}-books`],
    queryFn: () => getInitialBooks({ category }),
    staleTime: 1000 * 60 * 60,
  });

  return { data, status, isFetching };
}
