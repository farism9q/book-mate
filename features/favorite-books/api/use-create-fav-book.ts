import { client } from "@/lib/hono";
import { InferResponseType, InferRequestType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { User } from "@prisma/client";

type ResponseType =
  | User
  | InferResponseType<
      (typeof client.api)["favorite-books"][":bookId"]["$post"],
      403
    >;

type RequestType = InferRequestType<
  (typeof client.api)["favorite-books"][":bookId"]["$post"]
>["param"];

export const useCreateFavBook = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation<ResponseType, unknown, RequestType>({
    mutationFn: async json => {
      const response = await client.api["favorite-books"][":bookId"]["$post"]({
        param: json,
      });

      if (response.status === 403) {
        const { message, type } = await response.json();
        return {
          message,
          type,
        };
      }

      if (!response.ok) {
        throw new Error("Failed to create conversation");
      }

      const { updatedUser } = await response.json();

      return {
        ...updatedUser,
        createdAt: new Date(updatedUser.createdAt),
        updatedAt: new Date(updatedUser.updatedAt),
      } as User;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorite-books"] });
      queryClient.invalidateQueries({ queryKey: ["user-limit"] });
    },

    onError: () => {
      toast.error("Failed to create favorite book");
    },
  });

  return mutation;
};
