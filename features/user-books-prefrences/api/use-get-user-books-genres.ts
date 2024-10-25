import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export function useGetUserBooksGenres() {
  const { data, isLoading, error, failureCount, isSuccess } = useQuery({
    queryKey: ["user-genre-prefrences"],
    queryFn: async () => {
      const response = await client.api["user-books-prefrences"].$get();

      if (!response.ok && response.status !== 404) {
        throw new Error("Failed to get user genre prefrences");
      }

      const { userBookPreferences } = await response.json();

      return userBookPreferences;
    },
  });

  return { data, isLoading, error, failureCount, isSuccess };
}
