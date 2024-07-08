"use client";

import Image from "next/image";
import { SignOutButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useNavToggle } from "@/hooks/use-nav-toggle";
import { useGetAccount } from "@/features/account/api/use-get-account";
import { useGetUserLimit } from "@/features/user-limit/api/use-get-user-limit";
import { useGetSubscription } from "@/features/subscription/api/use-get-subscription";

import UserFreeLimit from "../user-free-limit";
import { ModeToggle } from "../mode-toggle";
import { NavigationItems } from "./navigation-items";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

interface NavigationSidebarProps {
  isMobile: boolean;
}

const NavigationSidebar = ({ isMobile }: NavigationSidebarProps) => {
  const { sessionId } = useAuth();
  const { toggleSidebar, isSidebarExpanded } = useNavToggle();
  const router = useRouter();

  const { data: user } = useGetAccount();
  const { data: userLimitCount, isLoading: isLoadingUserLimit } =
    useGetUserLimit();
  const { data: isSubscribed, isLoading: isLoadingSubscription } =
    useGetSubscription();

  const isLoading = isLoadingUserLimit || isLoadingSubscription;

  if (!sessionId) {
    router.replace("/");
    return;
  }

  return (
    <div
      className={cn(
        "relative flex flex-col h-full pt-6 px-2 bg-white border-r-2 border-zinc-100 dark:border-zinc-800 dark:bg-[#04090A] gap-y-6",
        isMobile && "w-full",
        !isSidebarExpanded &&
          !isMobile &&
          "w-14 trnasition-all duration-300 ease-in-out",
        isSidebarExpanded && !isMobile && "w-64"
      )}
    >
      {(isSidebarExpanded || isMobile) && (
        <div className="flex flex-col items-center px-0">
          <div className="mx-auto">
            {user ? (
              <Image
                src={user.userProfileImage?.imageUrl || user.imageURL}
                alt={user.name}
                className="rounded-md mx-auto w-40 h-32"
                width={160}
                height={128}
                priority
              />
            ) : (
              <Skeleton className="w-40 h-32 rounded-md mx-auto" />
            )}
          </div>
          <span className="text-lg font-semibold mt-4">{user?.name}</span>
        </div>
      )}

      <div className="min-w-8 h-full flex-1">
        <NavigationItems isMobile={isMobile} />
      </div>

      {(isSidebarExpanded || isMobile) && (
        <div className="w-full overflow-y-auto no-scrollbar flex flex-col pb-6">
          {isSubscribed === false && userLimitCount !== undefined && (
            <UserFreeLimit userLimitCount={userLimitCount} />
          )}
          {isLoading && <Skeleton className="min-h-60 min-w-[270px] w-full" />}
          <div className="flex flex-col items-center justify-center gap-y-6 mt-2 pr-2">
            <ModeToggle />
            <div className="w-full">
              <SignOutButton signOutOptions={{ sessionId }}>
                <div
                  className="w-full h-12 text-xl bg-rose-700 text-white rounded-md flex items-center justify-center 
                  hover:bg-rose-800 cursor-pointer
                "
                >
                  Sign out
                </div>
              </SignOutButton>
            </div>
          </div>
        </div>
      )}
      {!isMobile && (
        <button
          type="button"
          className="absolute z-50 bottom-[100px] right-[-12px] flex h-6 w-6 items-center justify-center rounded-full bg-zinc-300/70 text-slate-700 dark:bg-zinc-800/70 dark:text-slate-100 shadow-md hover:shadow-lg transition-shadow duration-300 ease-in-out"
          onClick={toggleSidebar}
        >
          {isSidebarExpanded ? (
            <ChevronLeft size={16} />
          ) : (
            <ChevronRight size={16} />
          )}
        </button>
      )}
    </div>
  );
};

export default NavigationSidebar;
