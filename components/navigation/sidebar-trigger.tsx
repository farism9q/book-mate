"use client";

import { useSidebar } from "@/components/ui/sidebar";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ChevronLast, ChevronFirst } from "lucide-react";

type SidebarTriggerProps = {
  className?: string;
};
export function SidebarCustomTrigger({ className }: SidebarTriggerProps) {
  const { toggleSidebar, open } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn(
        "h-12 w-5",
        open
          ? "right-2 rounded-l-full rounded-r-none"
          : "left-2 rounded-l-none rounded-r-full",
        "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground",
        className
      )}
      onClick={toggleSidebar}
    >
      {open ? (
        <ChevronFirst className="h-4 w-4" />
      ) : (
        <ChevronLast className="h-4 w-4" />
      )}
    </Button>
  );
}
