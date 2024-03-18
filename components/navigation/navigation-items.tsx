"use client";

import { useNavToggle } from "@/hooks/use-nav-toggle";
import { cn } from "@/lib/utils";
import { Book, MessageSquareMore, Star } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  {
    label: "Home",
    icon: <Book className="w-4 h-4" />,
    href: "/",
  },
  {
    label: "Favorite books",
    icon: <Star className="w-4 h-4" />,
    href: "/favorite-books",
  },
  {
    label: "Chatting",
    icon: <MessageSquareMore className="w-4 h-4" />,
    href: "/chatting",
  },
];

export const NavigationItems = () => {
  const pathname = usePathname();
  const { onOpenChange } = useNavToggle();

  return (
    <div className="flex flex-col h-full w-[90%] space-y-3">
      {routes.map(route => (
        <Link
          onClick={() => {
            onOpenChange();
          }}
          key={route.label}
          href={route.href}
          className={cn(
            "flex gap-x-2 rounded-md hover:bg-primary hover:text-white transition-all",
            pathname === route.href && "bg-primary text-white"
          )}
        >
          <div className="pl-6 flex items-center gap-x-2 py-2">
            {route.icon}
            <span className="text-md font-semibold">{route.label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};
