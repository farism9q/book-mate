import { useGetBookConversations } from "@/features/conversation/api/use-get-conversations";

import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuBadge,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type ConversationsMenuItemProps = {
  isActive: boolean;
};

export const ConversationsMenuItem = ({
  isActive,
}: ConversationsMenuItemProps) => {
  const { data: conversations, isLoading } = useGetBookConversations({});

  const nbConversationsWithMessages = conversations?.conversations.filter(
    conversation => conversation.messages.length > 0
  ).length;

  return (
    <SidebarMenuItem key="favorite-books">
      <SidebarMenuButton asChild isActive={isActive} tooltip={"Conversations"}>
        <Link href="/conversations">
          <MessageCircle />
          <span>Conversations</span>
        </Link>
      </SidebarMenuButton>

      <SidebarMenuBadge>
        {!isLoading && nbConversationsWithMessages}
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
