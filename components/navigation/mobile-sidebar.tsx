"use client";

import Link from "next/link";

import { useNavToggle } from "@/hooks/use-nav-toggle";

import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import NavigationSidebar from "./navigation-sidebar";

export default function MobileSidebar() {
  const { open, onOpenChange } = useNavToggle();

  return (
    <Sheet open={open} onOpenChange={() => onOpenChange()}>
      <Link href={"/"}>
        <h1 className="text-gradient text-2xl font-bold uppercase tracking-widest">
          Book mate
        </h1>
      </Link>
      <SheetTrigger className="ml-auto">
        <div className="p-2">
          <Menu className="size-6" />
        </div>
      </SheetTrigger>
      <SheetContent side={"right"} className="p-0">
        <NavigationSidebar isMobile={true} />
      </SheetContent>
    </Sheet>
  );
}
