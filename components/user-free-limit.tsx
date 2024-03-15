import { useModal } from "@/hooks/use-modal-store";
import { USER_FREE_LIMIT } from "@/constants";

import { Button } from "./ui/button";
import { Zap } from "lucide-react";

interface UserFreeLimitProps {
  userLimitCount: number;
  isSubscribed: boolean;
}

export default function UserFreeLimit({
  userLimitCount,
  isSubscribed,
}: UserFreeLimitProps) {
  const { onOpen } = useModal();

  if (isSubscribed) {
    return null;
  }

  const onUpgrade = () => {
    onOpen("upgradePlan");
  };
  return (
    <div className="flex flex-col items-center premium rounded-md space-y-6 p-4 mx-2">
      <h1 className="text-4xl font-semibold text-center">Free plan</h1>
      <p className="text-lg text-zinc-200 text-center">
        {`You have reached ${userLimitCount} of ${USER_FREE_LIMIT}.`}
      </p>
      <div className="flex flex-col items-center space-y-4">
        <p className="text-xs text-center text-zinc-200">
          You can pay to add unlimited books and chat.
        </p>
        <Button
          onClick={onUpgrade}
          variant={"premium"}
          className="uppercase hover:opacity-70"
        >
          upgrade
          <Zap className="w-4 h-4 ml-2 fill-white" />
        </Button>
      </div>
    </div>
  );
}
