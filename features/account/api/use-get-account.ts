import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { InitialUserType } from "@/types/initial-user";

export const useGetAccount = () => {
  const data = useQuery({
    queryKey: ["account"],
    queryFn: async () => {
      const response = await client.api.account.$get();

      if (!response.ok) {
        throw new Error("An error occurred while fetching user account");
      }

      const account = await response.json();

      if (!account || !account.userSettings) {
        throw new Error("User account not found");
      }

      return {
        ...account,
        userSettings: {
          ...account.userSettings,
          createdAt: new Date(account.userSettings.createdAt),
          updatedAt: new Date(account.userSettings.updatedAt),
        },
        createdAt: new Date(account.createdAt),
        updatedAt: new Date(account.updatedAt),
      } as InitialUserType;
    },
  });

  return data;
};
