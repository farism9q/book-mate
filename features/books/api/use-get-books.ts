import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { InferRequestType } from "hono";

type RequestType = InferRequestType<
  (typeof client.api)["google-books"]["$post"]
>["json"];

export const useGetBooks = ({
  booksId,
  query,
  queryKey,
}: {
  booksId?: RequestType["booksId"];
  query?: RequestType["query"];
  queryKey: string[];
}) => {
  const data = useQuery({
    queryKey: [...queryKey],
    queryFn: async () => {
      const response = await client.api["google-books"].$post({
        json: {
          booksId,
          query,
        },
      });

      if (!response.ok) {
        throw new Error("An error occurred while fetching favorite books");
      }

      const { books } = await response.json();

      return books;
    },
  });

  return data;
};
