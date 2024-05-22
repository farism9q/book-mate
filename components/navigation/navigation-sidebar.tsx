"use client";

import { useEffect, useState } from "react";
import { SignOutButton, useAuth } from "@clerk/nextjs";

import UserFreeLimit from "../user-free-limit";

import { ModeToggle } from "../mode-toggle";
import { NavigationItems } from "./navigation-items";
import Image from "next/image";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { InitialUserType } from "@/types/initial-user";

interface NavigationSidebarProps {
  user: InitialUserType;
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
    router.replace("/");
    return;
  }

  return (
    <div
      className="w-full md:w-[272px] flex flex-col h-full lg:fixed left-0 top-0 items-center pt-6 px-2 bg-white border-r-2
    border-zinc-800 dark:bg-[#04090A] gap-y-6"
    >
      <div className="flex flex-col items-center px-0">
        <div className="relative mx-auto">
          <div className="absolute rounded-md h-full w-full -z-20 blur-md animate-blob animation-delay-75 bg-primary/70 dark:bg-primary/40" />
          <div className="w-40 h-32">
            <Image
              src={user.userProfileImage.imageUrl}
              alt={user.name}
              className="rounded-md mx-auto"
              fill
            />
          </div>
        </div>
        <span className="text-lg font-semibold mt-4">{user?.name}</span>
      </div>

      <div className="flex-1 w-[90%]">
        <NavigationItems />
      </div>

      <div className="w-full overflow-y-auto no-scrollbar flex flex-col pb-6">
        {!isSubscribed && <UserFreeLimit userLimitCount={userLimitCount} />}
        <div className="flex flex-col items-center justify-center gap-y-6 mt-2 pr-2">
          <ModeToggle />
          <div className="w-full">
            <SignOutButton signOutOptions={{ sessionId }}>
              <Button variant={"destructive"} className="w-full h-12 text-xl">
                Sign out
              </Button>
            </SignOutButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationSidebar;
