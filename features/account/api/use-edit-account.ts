import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono";
import { UserAccountUpdate, SettingFields } from "@/features/account/types";

export const useEditAccount = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (userAccountUpdate: UserAccountUpdate) => {
      const response = await client.api.account.$patch({
        json: {
          userAccountUpdate,
        },
      });

      if (response.status === 400) {
        const { clerkError, errors } = await response.json();

        if (clerkError) {
          return {
            clerkError,
            errors,
          };
        }
      }

      if (!response.ok) {
        throw new Error("An error occurred while updating user account");
      }

      const { updatedUser } = await response.json();

      return updatedUser;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["account"],
      });
    },
  });

  return mutation;
};

export const useEditAccountSettings = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (settingFields: SettingFields) => {
      const response = await client.api.account.settings.$patch({
        json: {
          settingsToUpdate: settingFields,
        },
      });

      if (!response.ok) {
        throw new Error("An error occurred while updating user settings");
      }

      const { setting } = await response.json();

      return setting;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["account"],
      });
    },
  });

  return mutation;
};
