"use client";

import { useNavToggle } from "@/hooks/use-nav-toggle";
import { cn } from "@/lib/utils";
import { Book, MessageSquareMore, Star, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "../ui/separator";
import { ModeToggle } from "../mode-toggle";
import { Fragment } from "react";

const routes = [
  {
    label: "Books",
    icon: <Book className="w-4 h-4" />,
    href: "/books",
  },
  {
    label: "Favorite books",
    icon: <Star className="w-4 h-4" />,
    href: "/favorite-books",
  },
  {
    label: "Conversations",
    icon: <MessageSquareMore className="w-4 h-4" />,
    href: "/conversations",
  },
  {
    label: "Account",
    icon: <User className="w-4 h-4" />,
    href: "/account",
  },
];

type Props = {
  isMobile?: boolean;
};

export const NavigationItems = ({ isMobile }: Props) => {
  const pathname = usePathname();
  const { onClose, isSidebarExpanded } = useNavToggle();

  if (!isSidebarExpanded && !isMobile)
    return (
      <div className="flex flex-col justify-between h-full py-4">
        <div className="flex flex-col space-y-3">
          {routes.map(route => (
            <Fragment key={route.label}>
              {route.label === "Account" && <Separator />}
              <Link
                onClick={() => {
                  onClose();
                }}
                href={route.href}
                className={cn(
                  "flex gap-x-2 rounded-md hover:bg-primary hover:text-white transition-all",
                  pathname === route.href && "bg-primary text-white"
                )}
              >
                <div className="flex items-center justify-center w-full py-2">
                  {route.icon}
                </div>
              </Link>
            </Fragment>
          ))}
        </div>
        <ModeToggle direction="vertical" />
      </div>
    );

  return (
    <div className="flex flex-col space-y-3">
      {routes.map(route => (
        <Fragment key={route.label}>
          {route.label === "Account" && <Separator />}
          <Link
            onClick={() => {
              onClose();
            }}
            href={route.href}
            className={cn(
              "flex gap-x-2 rounded-md hover:bg-primary hover:text-white",
              pathname === route.href && "bg-primary text-white"
            )}
          >
            <div className="pl-2 lg:pl-6 flex items-center gap-x-2 py-2">
              {route.icon}
              <span className="text-sm">{route.label}</span>
            </div>
          </Link>
        </Fragment>
      ))}
    </div>
  );
};
