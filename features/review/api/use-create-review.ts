import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  typeof client.api.review.$post
>["newReview"];

type RequestType = InferRequestType<typeof client.api.review.$post>["json"];

export function useCreateReview() {
  const queryClient = useQueryClient();
  const mutate = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.review.$post({ json });

      if (!response.ok) {
        throw new Error("Failed to create review");
      }

      const { newReview } = await response.json();

      return newReview;
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
