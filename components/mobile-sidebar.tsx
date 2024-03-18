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
      <SheetTrigger className="absolute right-0 top-0">
        <Button variant={"ghost"} size={"icon"} className="md:hidden px-2">
          <Menu />
        </Button>
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
