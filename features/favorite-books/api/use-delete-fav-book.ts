import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType, InferRequestType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api)["favorite-books"][":favBookId"]["$delete"]
>;

type RequestType = InferRequestType<
  (typeof client.api)["favorite-books"][":favBookId"]["$delete"]
>["json"] &
  InferRequestType<
    (typeof client.api)["favorite-books"][":favBookId"]["$delete"]
  >["param"];

export const useDeleteFavBook = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async json => {
      const response = await client.api["favorite-books"][":favBookId"][
        "$delete"
      ]({
        param: {
          favBookId: json.favBookId,
        },
        json: {
          bookId: json.bookId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete favorite book");
      }

      const { success, message } = await response.json();

      return {
        success,
        message,
      };
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-books"] });
    },

    onError: () => {
      toast.error("Failed to delete favorite book");
    },
  });

  return mutation;
};
