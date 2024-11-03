"use client";

import { useGetAccount } from "@/features/account/api/use-get-account";
import { useGetUserLimit } from "@/features/user-limit/api/use-get-user-limit";
import { useGetSubscription } from "@/features/subscription/api/use-get-subscription";

import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { useAuth, useClerk } from "@clerk/nextjs";

import { Book, ChevronsUpDown, LogOut, Sun, Moon, User } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { FavoriteBooksMenuItem } from "./favorite-books-menu-item";
import UserFreeLimit from "@/components/user-free-limit";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ConversationsMenuItem } from "./conversations-menu-item";
import { SidebarCustomTrigger } from "./sidebar-trigger";
import MobileSidebar from "./mobile-sidebar";
import { PagesMenuGroup } from "./pages-menu-group";

export function AppSidebar() {
  const { isMobile } = useSidebar();

  if (isMobile) {
    return (
      <>
        <MobileSidebar />
        <SidebarPage />
      </>
    );
  }

  return <SidebarPage />;
}

function SidebarPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useClerk();

  const { sessionId } = useAuth();
  const { open, isMobile, state } = useSidebar();

  const { data: userLimitCount, isLoading: isLoadingUserLimit } =
    useGetUserLimit();
  const { data: isSubscribed, isLoading: isLoadingSubscription } =
    useGetSubscription();
  const { data: account } = useGetAccount();

  const { theme, setTheme } = useTheme();

  if (!sessionId) {
    router.replace("/");
    return;
  }

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Content</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem key={"books"}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/books"}
                  tooltip={"Browse books"}
                >
                  <Link href={"/books"}>
                    <Book />
                    <span>Books</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <FavoriteBooksMenuItem
                isActive={pathname === "/favorite-books"}
              />
              <ConversationsMenuItem isActive={pathname === "/conversations"} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarSeparator />

        {/* Pages group */}
        <PagesMenuGroup />

        <SidebarFooter className="mt-auto px-2">
          {(open || (isMobile && state === "collapsed")) && (
            <>
              {isSubscribed === false && userLimitCount !== undefined && (
                <UserFreeLimit userLimitCount={userLimitCount} />
              )}
              {(isLoadingUserLimit || isLoadingSubscription) && (
                <UserFreeLimitSkeleton />
              )}
            </>
          )}
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={account?.userProfileImage?.imageUrl}
                        alt={account?.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {account?.name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {account?.name}
                      </span>
                      <span className="truncate text-xs">{account?.email}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={account?.userProfileImage?.imageUrl}
                          alt={account?.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          {account?.name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {account?.name}
                        </span>
                        <span className="truncate text-xs">
                          {account?.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />

                  <Link href={"/account"}>
                    <DropdownMenuItem>
                      <User className="size-4 mr-2" />
                      Account
                    </DropdownMenuItem>
                  </Link>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={e => {
                      e.preventDefault();
                      setTheme(theme === "dark" ? "light" : "dark");
                    }}
                  >
                    {theme === "dark" ? (
                      <Sun className="size-4 mr-2" />
                    ) : (
                      <Moon className="size-4 mr-2" />
                    )}
                    {theme === "dark" ? "Light mode" : "Dark mode"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />

                  <Link
                    href={"/"}
                    onClick={e => {
                      e.stopPropagation();
                      setInterval(() => {
                        signOut();
                      }, 2000);
                    }}
                  >
                    <DropdownMenuItem>
                      <LogOut className="size-4 mr-2" />
                      Sign out
                    </DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        {!isMobile && (
          <div
            className={cn(
              "absolute inset-y-0 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] peer-hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex",
              "[[data-side=left]:-right-2"
            )}
          >
            <SidebarCustomTrigger className="absolute bottom-[15%]" />
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

function UserFreeLimitSkeleton() {
  return (
    <div className="flex flex-col premium items-center rounded-md w-full space-y-6 px-2 py-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-6 w-5/6" />
      <div className="flex flex-col items-center space-y-4 w-full">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
