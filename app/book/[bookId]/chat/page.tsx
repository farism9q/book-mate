export const maxDuration = 30;

import { redirect } from "next/navigation";
import qs from "query-string";
import axios from "axios";

import { initialUser } from "@/lib/initial-user";
import { db } from "@/lib/db";

import { Book } from "@/types/book";
import { createUpdateConversation } from "@/lib/conversation";
import { ChatPannel } from "@/app/book/[bookId]/chat/chat-pannel";
import { checkSubscription } from "@/lib/user-subscription";
import { userChatLimits } from "@/lib/user-limit";
import { ChatProvider } from "@/components/providers/chat-provider";

interface BookChatPageProps {
  params: { bookId: string };
}

const BookChatPage = async ({ params }: BookChatPageProps) => {
  const user = await initialUser();

  if (!user) {
    return redirect("/");
  }

  // Check if the user has the book as a favorite
  const userFavBook = await db.user.findFirst({
    where: {
      userClerkId: user.userClerkId,
      favorites: {
        some: {
          bookId: params.bookId,
        },
      },
    },
    include: {
      favorites: true,
    },
  });

  // If the user doesn't have the book as a favorite, redirect to the book page
  if (!userFavBook) {
    return redirect(`/books/${params.bookId}`);
  }

  let conversation = await createUpdateConversation(params.bookId);
  const url = qs.stringifyUrl({
    url: `https://www.googleapis.com/books/v1/volumes/${params.bookId}`,
    query: {
      key: process.env.GOOGLE_BOOK_API_KEY,
    },
  });

  const responsePromise = axios.get(url);

  const isSubscribedPromise = checkSubscription();
  const bookChatCountsLimitPromise = userChatLimits({
    conversationId: conversation.id,
  });

  const [response, isSubscribed, bookChatCountsLimit] = await Promise.all([
    responsePromise,
    isSubscribedPromise,
    bookChatCountsLimitPromise,
  ]);

  const book: Book = {
    id: response.data.id,
    volumeInfo: response.data.volumeInfo,
  };

  return (
    <ChatProvider>
      <div className="flex flex-col h-full w-full">
        <ChatPannel
          book={book}
          user={user}
          conversation={conversation}
          bookChatCountsLimit={bookChatCountsLimit || 0}
          isSubscribed={isSubscribed}
        />
      </div>
    </ChatProvider>
  );
};

export default BookChatPage;
