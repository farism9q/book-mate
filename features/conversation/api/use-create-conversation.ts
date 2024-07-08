import { client } from "@/lib/hono";
import { Conversation } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType } from "hono";
import { toast } from "sonner";

type RequestType = InferRequestType<
  typeof client.api.conversations.$post
>["json"];

export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<Conversation, unknown, RequestType>({
    mutationFn: async json => {
      const response = await client.api.conversations.$post({ json });

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      const { conversation } = await response.json();

      return {
        ...conversation,
        createdAt: new Date(conversation.createdAt),
        updatedAt: new Date(conversation.updatedAt),
      } as Conversation;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["book-conversations"] });
    },

    onError: () => {
      toast.error("Failed to create conversation");
    },
  });

  return mutation;
};
