"use client";

export const maxDuration = 30;

import { useRouter } from "next/navigation";
import { useGetFavoriteBooks } from "@/features/favorite-books/api/use-get-favorite-books";
import { useGetAccount } from "@/features/account/api/use-get-account";
import { useGetConversation } from "@/features/conversation/api/use-get-conversation";
import { useGetSubscription } from "@/features/subscription/api/use-get-subscription";

import { ChatPannel } from "@/features/conversation/comopnents/chat-pannel";
import { ChatLoader } from "@/features/conversation/comopnents/chat-loader";

interface BookChatPageProps {
  params: { bookId: string };
}

const BookChatPage = ({ params }: BookChatPageProps) => {
  const router = useRouter();

  const { data: userFavs, isLoading: userFavsLoading } = useGetFavoriteBooks(
    {}
  );

  const { data: user, isLoading: isLoadingUser } = useGetAccount();
  const { data: isSubscribed, isLoading: isSubscribedLoading } =
    useGetSubscription();

  const { data: conversation, isLoading: isConversationLoading } =
    useGetConversation({
      bookId: params.bookId,
    });

  if (
    userFavsLoading ||
    isLoadingUser ||
    isConversationLoading ||
    isSubscribedLoading
  ) {
    return <ChatLoader />;
  }

  const userFavBook = userFavs?.favoriteBooks.find(
    fav => fav.bookId === params.bookId
  );

  if (!userFavBook) {
    router.push(`/books/${params.bookId}`);
  }

  const book = userFavs?.books.find(book => book.id === params.bookId);

  if (
    !book ||
    !userFavBook ||
    !user ||
    !conversation ||
    isSubscribed === undefined
  ) {
    return null;
  }
  return (
    <div className="flex flex-col h-full w-full">
      <ChatPannel
        book={book}
        user={user}
        conversation={conversation}
        isSubscribed={isSubscribed}
      />
    </div>
  );
};

export default BookChatPage;
