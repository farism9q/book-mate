"use client";

import { useNavToggle } from "@/hooks/use-nav-toggle";
import { cn } from "@/lib/utils";
import { Book, MessageSquareMore, Star, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "../ui/separator";

const routes = [
  {
    label: "Home",
    icon: <Book className="w-4 h-4" />,
    href: "/books",
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
  const { onClose } = useNavToggle();

  return (
    <div className="flex flex-col space-y-3">
      {routes.map(route => (
        <Link
          onClick={() => {
            onClose();
          }}
          key={route.label}
          href={route.href}
          className={cn(
            "flex gap-x-2 rounded-md hover:bg-primary hover:text-white transition-all",
            pathname === route.href && "bg-primary text-white"
          )}
        >
          <div className="pl-2 lg:pl-6 flex items-center gap-x-2 py-2">
            {route.icon}
            <span className="text-md font-semibold">{route.label}</span>
          </div>
        </Link>
      ))}
      <Separator />
      <Link
        onClick={() => {
          onClose();
        }}
        key={"Account"}
        href={"/me"}
        className={cn(
          "flex gap-x-2 rounded-md hover:bg-primary hover:text-white transition-all",
          pathname === "/me" && "bg-primary text-white"
        )}
      >
        <div className="pl-2 lg:pl-6 flex items-center gap-x-2 py-2">
          {<User className="w-4 h-4" />}
          <span className="text-md font-semibold">{"Account"}</span>
        </div>
      </Link>
    </div>
  );
};
