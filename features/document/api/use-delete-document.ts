import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.document)[":documentId"]["$delete"]
>["deletedDocument"];

type RequestType = InferRequestType<
  (typeof client.api.document)[":documentId"]["$delete"]
>["param"];

export function useDeleteDocument() {
  const queryClient = useQueryClient();
  const mutate = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ documentId }: { documentId: string }) => {
      const response = await client.api.document[":documentId"].$delete({
        param: {
          documentId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to edit document");
      }

      const { deletedDocument } = await response.json();

      

      queryClient.invalidateQueries({
        queryKey: ["documents"],
      });
      queryClient.invalidateQueries({
        queryKey: ["document", { documentId }],
      });

      return deletedDocument;
    },

    onError: () => {
      toast.error("Failed to delete document");
    },
  });

  return mutate;
}
