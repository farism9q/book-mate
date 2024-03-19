"use client";

import { useState } from "react";
import axios from "axios";
import qs from "query-string";
import { useRouter } from "next/navigation";

import { Book, BookInfoForChatGPT } from "@/types";

const StartQuestionsData = [
  {
    question: "Who wrote the book?",
    description: "Know the author of the book you are reading.",
  },
  {
    question: "When was the book published?",
    description: "Know when the book was published.",
  },

  {
    question: "What is the book about?",
    description:
      "Know what the book is about. To decide if you want to read it.",
  },
  {
    question: "What prerequisite knowledge for reading the book?",
    description:
      "Prepares you for the book by outlining essential prerequisites.",
  },
];

const StartQuestions = ({ userId, book }: { userId: string; book: Book }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async (question: string) => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/book/chat`,
        query: {
          userId,
        },
      });

      await axios.post(url, {
        question,
        book: {
          id: book.id,
          title: book.volumeInfo.title,
          publisher: book.volumeInfo.publisher,
          authors: book.volumeInfo.authors,
          publishedDate: book.volumeInfo.publishedDate,
        } as BookInfoForChatGPT,
      });

      setIsLoading(false);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  // TODO - Check the fourth question and try to make the component more readable and responsive

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="text-center py-6">
        <h3 className="dark:text-white text-2xl">Start Questions</h3>
        <p className="text-zinc-400 text-sm">
          You can start chatting with the book now.
        </p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-center">
        {StartQuestionsData.map(data => (
          <button
            key={data.question}
            disabled={isLoading}
            onClick={() => onClick(data.question)}
            className={
              isLoading
                ? "cursor-not-allowed opacity-40 transition-all"
                : "hover:opacity-40"
            }
          >
            <div className="flex flex-col justify-center h-full space-y-2 bg-primary/20 border-2 border-primary rounded-lg p-3">
              <h3 className="dark:text-white text-lg">{data.question}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                {data.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StartQuestions;
