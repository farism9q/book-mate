import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.review)[":reviewId"]["$patch"]
>["updatedReview"];

type RequestType = InferRequestType<
  (typeof client.api.review)[":reviewId"]["$patch"]
>["json"];

export function useEditReview(reviewId: string) {
  const queryClient = useQueryClient();
  const mutate = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.review[":reviewId"].$patch({
        json,
        param: { reviewId },
      });

      if (!response.ok) {
        throw new Error("Failed to edit review");
      }

      const { updatedReview } = await response.json();

      return updatedReview;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });
    },

    onError: () => {
      toast.error("Failed to create review");
    },
  });

  return mutate;
}
