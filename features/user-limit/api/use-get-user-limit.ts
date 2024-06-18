import { client } from "@/lib/hono";
import { useQuery } from "@tanstack/react-query";

export function useGetUserLimit() {
  const data = useQuery({
    queryKey: ["user-limit"],
    queryFn: async () => {
      const response = await client.api["user-limit"].$get();

      if (!response.ok) {
        throw new Error("Failed to get user limit");
      }

      const { userLimit } = await response.json();

      return userLimit.count;
    },
  });

  return data;
}
