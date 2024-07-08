"use client";

import { useMedia } from "react-use";

import MobileSidebar from "./mobile-sidebar";
import NavigationSidebar from "./navigation-sidebar";

export const Sidebar = () => {
  const isMobile = useMedia("(max-width: 1024px)", false);

  if (isMobile) {
    return (
      <div
        className="lg:hidden h-14 sticky px-2 mx-2 mt-4 top-4 z-50 
      flex justify-center items-center 
      bg-background/55 backdrop-blur-md border border-border rounded-2xl"
      >
        <MobileSidebar />
      </div>
    );
  }

  return (
    <div className="hidden lg:flex">
      <NavigationSidebar isMobile={false} />
    </div>
  );
};
