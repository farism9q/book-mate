"use client";
import { useEffect, useState } from "react";

import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import NavigationSidebar from "./navigation/navigation-sidebar";
import { User } from "@prisma/client";

interface MobileSidebarProps {
  user: User;
}

export default function MobileSidebar({ user }: MobileSidebarProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (!user) return null;
  return (
    <Sheet>
      <SheetTrigger>
        <Button variant={"ghost"} size={"icon"} className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent side={"left"} className="p-0">
        <NavigationSidebar user={user} />
      </SheetContent>
    </Sheet>
  );
}
