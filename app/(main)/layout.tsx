"use client";
import { useGetUserBooksGenres } from "@/features/user-books-prefrences/api/use-get-user-books-genres";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useModal } from "@/hooks/use-modal-store";

import { ScrollArea } from "@/components/ui/scroll-area";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useAuth();
  const { onOpen } = useModal();

  if (!userId) {
    return redirect("/");
  }

  const { data: userBooksGenres, isLoading: isUserBooksGenresLoading } =
    useGetUserBooksGenres();

  useEffect(() => {
    if (
      (!userBooksGenres && !isUserBooksGenresLoading) ||
      userBooksGenres?.genres?.length === 0
    ) {
      onOpen("userBooksPrefrences");
    }
  }, [onOpen, isUserBooksGenresLoading, userBooksGenres]);

  return (
    <SidebarProvider>
      <div className="md:flex w-full h-full">
        <AppSidebar />
        <ScrollArea className="md:flex-1 overflow-y-auto no-scrollbar bg-white dark:bg-black dark:text-white">
          {children}
        </ScrollArea>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
