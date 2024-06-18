"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  direction?: "horizontal" | "vertical";
};

export function ModeToggle({ direction = "horizontal" }: Props) {
  const { setTheme, theme } = useTheme();

  return (
    <div
      className={cn(
        "flex items-center gap-x-2",
        direction === "vertical" && "flex-col gap-y-2"
      )}
    >
      <Button
        onClick={() => setTheme("light")}
        variant="outline"
        className={
          theme === "light" ? "bg-muted-foreground/20" : "bg-transparent"
        }
        size="icon"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-black dark:text-white" />
      </Button>
      <Button
        onClick={() => setTheme("dark")}
        variant="outline"
        className={
          theme === "dark" ? "bg-muted-foreground/20" : "bg-transparent"
        }
        size="icon"
      >
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-black dark:text-white" />
      </Button>
    </div>
  );
}
