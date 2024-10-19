import { client } from "@/lib/hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<
  (typeof client.api.conversations)[":conversationId"]["$post"]
>["json"];

export const useCreateConversationMessage = ({
  conversationId,
}: {
  conversationId: string;
}) => {
  const queryClient = useQueryClient();
  const mutation = useMutation<boolean, unknown, RequestType>({
    mutationFn: async json => {
      const response = await client.api.conversations[":conversationId"].$post({
        json: {
          question: json.question,
          text: json.text,
          files: json.files,
        },
        param: {
          conversationId,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create conversation message");
      }

      const { success } = await response.json();

      return success;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`chat-${conversationId}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`chat-${conversationId}-limit`],
      });
      queryClient.invalidateQueries({
        queryKey: ["book-conversations"],
      });
    },

    onError: () => {
      toast.error("Failed to create conversation message");
    },
  });

  return mutation;
};
