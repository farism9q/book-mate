import { Message, User } from "@prisma/client";

import StartQuestions from "./start-questions";
import { Book } from "@/types";
import ChatItem from "./chat-item";

interface ChatMessagesProps {
  book: Book;
  user: User;
  messages: Message[];
}

const ChatMessages = ({ book, user, messages }: ChatMessagesProps) => {
  return (
    <div className="flex-1 overflow-y-auto no-scrollbar my-4 px-20">
      {messages.length === 0 && <StartQuestions book={book} userId={user.id} />}
      {
        <div className="flex flex-col-reverse mt-auto">
          {messages.map(message => (
            <div key={message.id} className="flex flex-col py-4">
              <ChatItem
                type="user"
                avatar={user.imageURL}
                text={message.userQuestion}
              />
              <ChatItem
                type="chatgpt"
                avatar={"/chatgpt-logo.png"}
                text={message.chatGPTResponse}
              />
            </div>
          ))}
        </div>
      }
    </div>
  );
};

export default ChatMessages;
