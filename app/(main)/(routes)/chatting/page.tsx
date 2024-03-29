import axios from "axios";
import qs from "query-string";
import Link from "next/link";
import { redirectToSignIn } from "@clerk/nextjs";
import { formatRelative } from "date-fns";

import { db } from "@/lib/db";
import { initialUser } from "@/lib/initial-user";
import { Book } from "@/types";

import { EntityAvatar } from "@/components/entity-avatar";
import RoutePage from "@/components/route-page";
import Empty from "@/components/empty";

const ChattingPage = async () => {
  const user = await initialUser();
  if (!user) {
    return redirectToSignIn();
  }

  const conversations = await db.conversation.findMany({
    where: {
      userId: user.id,
      deleted: {
        not: true,
      },
    },
    include: {
      messages: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Map over the favoriteBooksIds to create an array of promises
  const bookPromises = conversations.map(conversation => {
    const url = qs.stringifyUrl({
      url: `https://www.googleapis.com/books/v1/volumes/${conversation.bookId}`,
      query: {
        key: process.env.NEXT_PUBLIC_GOOGLE_BOOKS_API_KEY,
      },
    });
    return axios.get(url);
  });

  // 1) Call the books API to get the books using promise.all
  const booksResponses = await Promise.all(bookPromises);
  // 2) Extract the book data from the responses
  const chattedBooks = booksResponses.map(response => {
    return {
      id: response.data.id,
      volumeInfo: { ...response.data.volumeInfo },
    } as Book;
  });

  return (
    <RoutePage title="Chatting" className="space-y-4 px-4">
      {conversations.length > 0 ? (
        conversations.map(
          (conversation, idx) =>
            // Only conversations with messages
            conversation.messages.length > 0 && (
              <Link
                key={conversation.id}
                href={`/books/${conversation.bookId}/chat`}
                className="cursor-pointer border border-gray-200 rounded-md mx-2 mb-2 p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 transition duration-200 ease-in-out"
              >
                <div className="flex items-center gap-x-2 py-1">
                  <EntityAvatar
                    src={chattedBooks[idx].volumeInfo.imageLinks.thumbnail}
                    alt={chattedBooks[idx].volumeInfo.title}
                    className="md:w-16 md:h-16"
                  />
                  <h1>{chattedBooks[idx].volumeInfo.title}</h1>
                  <div className="ml-auto text-center space-y-1">
                    <span>
                      {formatRelative(
                        new Date(conversations[idx].updatedAt),
                        new Date()
                      )}
                    </span>
                  </div>
                </div>
              </Link>
            )
        )
      ) : (
        <Empty label="No chatting started yet" />
      )}
    </RoutePage>
  );
};

export default ChattingPage;
