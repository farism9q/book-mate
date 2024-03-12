import MobileSidebar from "@/components/mobile-sidebar";
import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import { initialUser } from "@/lib/initial-user";
import React from "react";

const layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await initialUser();

  if (!user) {
    return null;
  }

  return (
    <div className="h-full">
      <div className="hidden md:flex flex-col h-full w-[290px] z-30 fixed inset-y-0">
        <NavigationSidebar user={user} />
      </div>
      <nav className="md:hidden sticky top-0 mr-2 z-40">
        <MobileSidebar user={user} />
      </nav>
      <main className="lg:pl-[290px] h-full">{children}</main>
    </div>
  );
};

export default layout;
