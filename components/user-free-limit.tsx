import { useModal } from "@/hooks/use-modal-store";
import { USER_FREE_LIMIT } from "@/constants";

import { Button } from "./ui/button";
import { Zap } from "lucide-react";
import { Progress } from "./ui/progress";

interface UserFreeLimitProps {
  userLimitCount: number;
}

export default function UserFreeLimit({ userLimitCount }: UserFreeLimitProps) {
  const { onOpen } = useModal();

  const onUpgrade = () => {
    onOpen("upgradePlan");
  };

  if (userLimitCount === USER_FREE_LIMIT) {
    return (
      <div
        className="flex flex-col items-center rounded-md w-full space-y-6 px-2 py-4
        premium
      "
      >
        <h1
          className="text-[22px] font-semibold text-center
        "
        >
          You have reached your free books limit{" "}
        </h1>
        <p
          className="text-md text-center text-sky-100
        "
        >
          Upgrade to premium to add unlimited books and chat
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
    );
  }

  return (
    <div className="flex flex-col premium items-center rounded-md w-full space-y-6 px-2 py-4">
      <h1 className="text-4xl font-semibold text-center text-premuim">
        Free plan
      </h1>
      <p className="text-lg text-center text-zinc-300">
        {`You have reached ${userLimitCount} of ${USER_FREE_LIMIT}.`}
      </p>
      <div className="flex flex-col items-center space-y-4">
        <p className="text-xs text-center text-zinc-300">
          You can pay to add unlimited books and chat.
        </p>
        <Progress value={(userLimitCount / USER_FREE_LIMIT) * 100} />
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
