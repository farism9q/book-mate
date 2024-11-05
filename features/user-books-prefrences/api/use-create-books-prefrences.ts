import { Category } from "@/constants";
import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateUserBooksPrefrences() {
  const clientQuery = useQueryClient();
  const data = useMutation({
    mutationKey: ["user-books-prefrences"],
    mutationFn: async (data: { categories: Category[] }) => {
      const response = await client.api["user-books-prefrences"].$post({
        json: {
          genres: data.categories,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to get user books prefrences");
      }

      const { userBookPreferences } = await response.json();

      clientQuery.invalidateQueries({
        queryKey: ["user-recommended-books"],
      });
      clientQuery.invalidateQueries({
        queryKey: ["user-genre-prefrences"],
      });

      return userBookPreferences;
    },
  });

  return data;
}
