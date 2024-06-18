import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api)["favorite-books"][":favBookId"]["$patch"]
>;

type RequestType = InferRequestType<
  (typeof client.api)["favorite-books"][":favBookId"]["$patch"]
>["json"] &
  InferRequestType<
    (typeof client.api)["favorite-books"][":favBookId"]["$patch"]
  >["param"];

export const useEditFavBook = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async json => {
      const response = await client.api["favorite-books"][":favBookId"][
        "$patch"
      ]({
        param: {
          favBookId: json.favBookId,
        },
        json: {
          status: json.status,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to update favorite book");
      }

      const { updatedFavBook } = await response.json();

      return {
        updatedFavBook,
      };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-books"] });
    },

    onError: () => {
      toast.error("Failed to update favorite book");
    },
  });

  return mutation;
};
