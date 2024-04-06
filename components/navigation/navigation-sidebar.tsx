"use client";

import { useEffect, useState } from "react";
import { SignOutButton, useAuth } from "@clerk/nextjs";
import { User } from "@prisma/client";

import UserFreeLimit from "../user-free-limit";

import { ModeToggle } from "../mode-toggle";
import { NavigationItems } from "./navigation-items";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

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
  const { sessionId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (!sessionId) {
    router.replace("/sign-in");
    return;
  }

  return (
    <div
      className="flex flex-col h-full lg:fixed left-0 top-0 items-center pt-6 px-2 bg-white border-r-2
    border-zinc-800 dark:bg-[#04090A] gap-y-6"
    >
      <div className="flex flex-col items-center px-0">
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

      <div className="flex-1 w-[90%]">
        <NavigationItems />
      </div>

      <div className="overflow-y-auto no-scrollbar flex flex-col pb-6">
        <UserFreeLimit
          userLimitCount={userLimitCount}
          isSubscribed={isSubscribed}
        />
        <div className="flex flex-col items-center justify-center gap-y-6 mt-2 pr-2">
          <ModeToggle />
          <SignOutButton signOutOptions={{ sessionId }}>
            <Button variant={"destructive"}>Sign out</Button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
};

export default NavigationSidebar;
