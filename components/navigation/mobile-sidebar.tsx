"use client";

import Link from "next/link";

import { Menu } from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";

export default function MobileSidebar() {
  const { toggleSidebar } = useSidebar();

  return (
    <div
      className="lg:hidden h-14 sticky px-2 mx-2 mt-4 top-4 z-50
      flex justify-between items-center
      bg-background/55 backdrop-blur-md border border-border rounded-2xl"
    >
      <Link href={"/"}>
        <h1 className="text-gradient text-2xl font-bold uppercase tracking-widest">
          Book mate
        </h1>
      </Link>

      <Button size={"icon"} variant={"ghost"} onClick={toggleSidebar}>
        <Menu />
      </Button>
    </div>
  );
}
