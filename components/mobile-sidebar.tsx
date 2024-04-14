"use client";
import { useEffect, useState } from "react";

import { User } from "@prisma/client";

import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import NavigationSidebar from "./navigation/navigation-sidebar";
import { useNavToggle } from "@/hooks/use-nav-toggle";

interface MobileSidebarProps {
  user: User;
  userLimitCount: number;
  isSubscribed: boolean;
}

export default function MobileSidebar({
  user,
  userLimitCount,
  isSubscribed,
}: MobileSidebarProps) {
  const [isMounted, setIsMounted] = useState(false);
  const { open, onOpenChange } = useNavToggle();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (!user) return null;

  return (
    <Sheet open={open} onOpenChange={() => onOpenChange()}>
      <h1 className="text-primary text-lg font-bold p-2">Book mate.</h1>
      <SheetTrigger className="ml-auto">
        <button className="p-2">
          <Menu className="w-5 h-5" />
        </button>
      </SheetTrigger>
      <SheetContent side={"right"} className="p-0">
        <NavigationSidebar
          user={user}
          userLimitCount={userLimitCount}
          isSubscribed={isSubscribed}
        />
      </SheetContent>
    </Sheet>
  );
}
