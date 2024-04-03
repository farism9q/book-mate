import { Book } from "@/types/book";

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
type Props = {
  userId: string;
  book: Book;
  onSendMessage: (message: string) => void;
  isPending: boolean;
};
const StartQuestions = ({ userId, book, onSendMessage, isPending }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 overflow-auto no-scrollbar ">
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
            disabled={isPending}
            onClick={() => onSendMessage(data.question)}
            className={
              isPending
                ? "cursor-not-allowed opacity-40 transition-all"
                : "hover:opacity-40"
            }
          >
            <div className="flex flex-col justify-center h-full space-y-2 bg-primary/20 border-2 border-primary rounded-lg p-3">
              <h3 className="dark:text-white text-sm md:text-lg">
                {data.question}
              </h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm">
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
