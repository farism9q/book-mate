"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center gap-x-2">
      <Button
        onClick={() => setTheme("light")}
        variant="outline"
        className={theme === "light" ? "bg-[#f2f2f2b6]" : "bg-transparent"}
        size="icon"
      >
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-black dark:text-white" />
      </Button>
      <Button
        onClick={() => setTheme("dark")}
        variant="outline"
        className={theme === "dark" ? "bg-transparent/30" : "bg-transparent"}
        size="icon"
      >
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all text-black dark:text-white" />
      </Button>
    </div>
  );
}
