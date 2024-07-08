import { useQuery } from "@tanstack/react-query";

import { checkSubscription } from "@/lib/user-subscription";

export const useGetSubscription = () => {
  const query = useQuery({
    queryKey: ["subscription"],
    queryFn: async () => {
      const isValid = await checkSubscription();
      return isValid;
    },
  });

  return query;
};
