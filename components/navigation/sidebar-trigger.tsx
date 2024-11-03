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
        "size-6",
        open ? "-right-1" : "-left-1",
        "rounded-full bg-sidebar-foreground/10 text-sidebar-foreground/70",
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
