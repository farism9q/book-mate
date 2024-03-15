"use client";

import { useEffect, useState } from "react";
import { UserButton } from "@clerk/nextjs";
import { User } from "@prisma/client";

import UserFreeLimit from "../user-free-limit";

import { EntityAvatar } from "../entity-avatar";
import { ModeToggle } from "../mode-toggle";
import { NavigationItems } from "./navigation-items";

interface NavigationSidebarProps {
  user: User;
  userLimitCount: number;
  isSubscribed: boolean;
}

const NavigationSidebar = ({
  user,
  userLimitCount,
  isSubscribed,
}: NavigationSidebarProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <div
      className="flex flex-col h-full w-full items-center py-6 bg-white border-r-2
    border-zinc-500 dark:bg-[#212121] gap-y-6"
    >
      <div className="flex flex-col items-center">
        <EntityAvatar src={user?.imageURL} alt={user?.name || ""} />
        <span className="text-sm font-semibold mt-4">{user?.name}</span>
      </div>

      <NavigationItems />

      <UserFreeLimit
        userLimitCount={userLimitCount}
        isSubscribed={isSubscribed}
      />
      <div className="flex items-center justify-center gap-x-2">
        <UserButton />
        <ModeToggle />
      </div>
    </div>
  );
};

export default NavigationSidebar;
