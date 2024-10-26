"use client";
import { redirect } from "next/navigation";
import { useAuth } from "@clerk/nextjs";

import { ScrollArea } from "@/components/ui/scroll-area";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = useAuth();

  if (!userId) {
    return redirect("/");
  }

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
