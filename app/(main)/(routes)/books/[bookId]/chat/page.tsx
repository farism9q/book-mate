import { redirect } from "next/navigation";
import qs from "query-string";
import axios from "axios";

import { initialUser } from "@/lib/initial-user";
import { db } from "@/lib/db";

import { Book } from "@/types";
import ChatHeader from "@/components/chat/chat-header";
import { createUpdateConversation } from "@/lib/conversation";
import { ChatPannel } from "@/components/chat/chat-pannel";
import { checkSubscription } from "@/lib/user-subscription";
import { userChatLimits, userHasFreeLimit } from "@/lib/user-limit";

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

  const url = qs.stringifyUrl({
    url: `https://www.googleapis.com/books/v1/volumes/${params.bookId}`,
    query: {
      key: process.env.GOOGLE_BOOK_API_KEY,
    },
  });

  const response = await axios.get(url);

  const book: Book = {
    id: response.data.id,
    volumeInfo: response.data.volumeInfo,
  };

  let conversation = await createUpdateConversation(params.bookId);

  const isSubscribedPromise = checkSubscription();
  const bookChatCountsLimitPromise = userChatLimits({
    conversationId: conversation.id,
  });

  const [isSubscribed, bookChatCountsLimit] = await Promise.all([
    isSubscribedPromise,
    bookChatCountsLimitPromise,
  ]);

  return (
    <div className="flex flex-col h-full w-full">
      <ChatHeader
        book={book}
        bookChatCountsLimit={bookChatCountsLimit || 0}
        isSubscribed={isSubscribed}
      />
      <ChatPannel book={book} user={user} conversation={conversation} />
    </div>
  );
};

export default BookChatPage;
