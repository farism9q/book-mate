"use client";

import { useGetBookConversations } from "@/features/conversation/api/use-get-conversations";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { formatRelative } from "date-fns";

import { EntityAvatar } from "@/components/entity-avatar";
import { Skeleton } from "@/components/ui/skeleton";
import RoutePage from "@/components/route-page";
import Empty from "@/components/empty";

const sortOpt = [
  { value: "desc", label: "Newest" },
  { value: "asc", label: "Oldest" },
];

type Props = {
  params: {};
  searchParams: {
    date: string;
  };
};

const ConversationsPage = ({ searchParams }: Props) => {
  const router = useRouter();
  const pathname = usePathname();
  const { date } = searchParams;

  const { data, isLoading } = useGetBookConversations({ sort: date });

  if (isLoading) {
    return (
      <RoutePage title="Conversations" className="space-y-4">
        {Array.from({ length: 12 }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between space-x-4 px-4 w-full"
          >
            <div className="flex items-center gap-x-4">
              <Skeleton className="h-10 w-10 md:h-16 md:w-16 rounded-full" />
              <Skeleton className="h-4 w-[250px]" />
            </div>
            <Skeleton className="h-4 w-[80px]" />
          </div>
        ))}
      </RoutePage>
    );
  }

  if (!data) {
    return null;
  }

  const { conversations, chattedBooks } = data;

  const hasNoConversations =
    conversations.length === 0 ||
    conversations.every(conversation => conversation.messages.length === 0);

  return (
    <RoutePage
      title="Conversations"
      className="space-y-4 px-4"
      sort={
        hasNoConversations
          ? undefined
          : {
              options: sortOpt,
              urlQuery: "date",
            }
      }
    >
      {!hasNoConversations ? (
        conversations.map(
          (conversation, idx) =>
            // Only conversations with messages
            conversation.messages.length > 0 && (
              <button
                key={conversation.id}
                onClick={() => {
                  sessionStorage.setItem("prevPath", pathname);
                  router.push(`/book/${conversation.bookId}/conversation`);
                }}
                className="cursor-pointer border border-gray-200 rounded-md mb-2 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 transition duration-200 ease-in-out"
              >
                <div className="flex items-center gap-x-2 py-1">
                  <div className="flex-1 flex items-center gap-x-2">
                    <EntityAvatar
                      src={chattedBooks[idx].volumeInfo.imageLinks.thumbnail}
                      alt={chattedBooks[idx].volumeInfo.title}
                      className="md:w-16 md:h-16"
                    />
                    <h1 className="line-clamp-1">
                      {chattedBooks[idx].volumeInfo.title}
                    </h1>
                  </div>

                  <span className="text-muted-foreground text-xs md:text-sm">
                    {formatRelative(
                      new Date(conversations[idx].updatedAt),
                      new Date()
                    )}
                  </span>
                </div>
              </button>
            )
        )
      ) : (
        <Empty
          label="No chats started yet"
          description="Start a chat with a book to see them here."
          img={{ src: "/no-chats.png", alt: "No chats" }}
        />
      )}
    </RoutePage>
  );
};

export default ConversationsPage;
