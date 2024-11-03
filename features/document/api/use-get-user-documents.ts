import { useQuery, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetUserDocuments = ({
  isArchive,
}: {
  isArchive?: boolean;
} = {}) => {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["documents", { isArchive }],
    queryFn: async () => {
      const response = await client.api.document.$get({
        query: {
          isArchive: isArchive ? "true" : "false",
        },
      });

      if (!response.ok) {
        throw new Error("An error occurred while fetching user reviews");
      }

      const { documents } = await response.json();

      documents.map(document => {
        queryClient.setQueryData(
          ["document", { documentId: document.id }],
          document
        );
      });

      return documents;
    },
  });

  return { data, isLoading, error };
};

export const useGetUserDocument = (documentId: string) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["document", { documentId }],
    queryFn: async () => {
      const response = await client.api.document[":documentId"].$get({
        param: {
          documentId,
        },
      });

      if (!response.ok) {
        throw new Error("An error occurred while fetching user review");
      }

      const { document } = await response.json();

      return document;
    },
  });

  return { data, isLoading, error };
};
