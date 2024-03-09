import NavigationSidebar from "@/components/navigation/navigation-sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full">
      <div className="hidden lg:flex flex-col h-full w-[200px] z-30 fixed inset-y-0">
        <NavigationSidebar />
      </div>
      <main className="lg:pl-[200px] h-full">{children}</main>
    </div>
  );
};

export default layout;
