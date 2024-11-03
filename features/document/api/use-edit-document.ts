import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.document)[":documentId"]["$patch"]
>["updatedDocument"];

type RequestType = InferRequestType<
  (typeof client.api.document)[":documentId"]["$patch"]
>["json"] & { documentId: string };

export function useEditDocument() {
  const queryClient = useQueryClient();
  const mutate = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async json => {
      const response = await client.api.document[":documentId"].$patch({
        json,
        param: { documentId: json.documentId },
      });

      if (!response.ok) {
        throw new Error("Failed to edit document");
      }

      const { updatedDocument } = await response.json();

      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });
      queryClient.invalidateQueries({
        queryKey: ["document", { documentId: json.documentId }],
      });

      return updatedDocument;
    },

    onError: () => {
      toast.error("Failed to edit document");
    },
  });

  return mutate;
}
