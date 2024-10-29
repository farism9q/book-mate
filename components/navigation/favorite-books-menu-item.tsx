import { useGetFavoriteBooks } from "@/features/favorite-books/api/use-get-favorite-books";

import Link from "next/link";

import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import { Heart } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type FavoriteBooksMenuItemProps = {
  isActive: boolean;
};

export const FavoriteBooksMenuItem = ({
  isActive,
}: FavoriteBooksMenuItemProps) => {
  const { data: favoriteBooks, isLoading } = useGetFavoriteBooks({});

  return (
    <SidebarMenuItem key="favorite-books">
      <SidebarMenuButton asChild isActive={isActive} tooltip={"Favorite books"}>
        <Link href="/favorite-books">
          <Heart />
          <span>Favorite Books</span>
        </Link>
      </SidebarMenuButton>

      <SidebarMenuBadge>
        {!isLoading && favoriteBooks?.favoriteBooks.length}
        {isLoading && (
          <Skeleton
            className="size-4 rounded-sm"
            data-sidebar="menu-skeleton-icon"
          />
        )}
      </SidebarMenuBadge>
    </SidebarMenuItem>
  );
};
