import axios from "axios";
import qs from "query-string";
import { db } from "@/lib/db";
import { initialUser } from "@/lib/initial-user";
import { redirectToSignIn } from "@clerk/nextjs";
import { Book } from "@/types";
import { EntityAvatar } from "@/components/entity-avatar";
import Link from "next/link";
import RoutePage from "@/components/route-page";

const ChattingPage = async () => {
  const user = await initialUser();
  if (!user) {
    return redirectToSignIn();
  }

  const conversations = await db.conversation.findMany({
    where: {
      userId: user.id,
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
    <RoutePage title="Chatting" className="space-y-4">
      {conversations.map((conversation, idx) => (
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
              <p className="text-zinc-400 dark:text-zinc-500">Last chat time</p>
              <span>
                {new Date(conversations[idx].updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </RoutePage>
  );
};

export default ChattingPage;
