"use client";

import { useEffect, useState } from "react";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import { User } from "@prisma/client";

import UserFreeLimit from "../user-free-limit";

import { ModeToggle } from "../mode-toggle";
import { NavigationItems } from "./navigation-items";
import { Loader2 } from "lucide-react";
import Image from "next/image";

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
        <div className="relative w-40 h-32">
          <Image
            fill
            src={user?.imageURL}
            alt={user?.name || ""}
            className="rounded-md"
          />
        </div>
        <span className="text-lg font-semibold mt-4">{user?.name}</span>
      </div>

      <div className="flex-1  w-[90%]">
        <NavigationItems />
      </div>

      <UserFreeLimit
        userLimitCount={userLimitCount}
        isSubscribed={isSubscribed}
      />
      <div className="w-full flex items-center justify-center gap-x-2 mt-2 pr-2 mb-[-12px]">
        <ClerkLoading>
          <Loader2 className="w-5 h-5 text-muted-foreground animate-spin" />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton afterSignOutUrl="/sign-in" />
          <ModeToggle />
        </ClerkLoaded>
      </div>
    </div>
  );
};

export default NavigationSidebar;
