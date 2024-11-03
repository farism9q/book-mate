import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  typeof client.api.document.$post
>["document"];

export function useCreateDocument() {
  const queryClient = useQueryClient();
  const mutate = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.document.$post();

      if (!response.ok) {
        throw new Error("Failed to create document");
      }

      const { document } = await response.json();

      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });
      queryClient.invalidateQueries({
        queryKey: ["document", { documentId: document.id }],
      });
      return document;
    },

    onError: () => {
      toast.error("Failed to create document");
    },
  });

  return mutate;
}
