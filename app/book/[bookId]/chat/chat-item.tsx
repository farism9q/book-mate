"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { EntityAvatar } from "../../../../components/entity-avatar";
import { Check, Copy, Share } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ChatItemProps {
  type: "user" | "chatgpt";
  text: string;
  avatar: string;
  question?: string;
  bookTitle?: string;
  bookImageUrl?: string;
}

const ChatItem = ({
  type,
  question,
  text,
  avatar,
  bookTitle,
  bookImageUrl,
}: ChatItemProps) => {
  const [copied, setCopied] = useState(false);
  const { onOpen } = useModal();

  const onCopy = () => {
    navigator.clipboard.writeText(type === "chatgpt" ? text : "");
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };
  return (
    <div
      className={
        "p-2 pt-2 border border-gray-300 rounded-lg bg-white dark:bg-gray-800 dark:border-gray-600"
      }
    >
      <div className={"flex gap-2"}>
        <EntityAvatar
          src={avatar}
          alt={type === "user" ? "User avatar" : "ChatGPT avatar"}
          className="w-6 h-6 md:w-8 md:h-8"
        />
        <div
          className={cn(
            "w-full flex flex-col px-2 md:px-4",
            type === "chatgpt" ? "justify-between gap-y-1" : "justify-center"
          )}
        >
          <p className="text-gray-800 dark:text-gray-200">{text}</p>

          {type === "chatgpt" && (
            <div className="p-1 w-full flex items-center gap-x-4">
              <button
                onClick={onCopy}
                className="group-hover:flex items-center justify-center"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              <button
                onClick={() => {
                  onOpen("sendEmail", {
                    email: {
                      bookText: text,
                      bookImageUrl: bookImageUrl || "",
                      bookTitle: bookTitle || "Book title",
                      question: question || "",
                    },
                  });
                }}
                className="group-hover:flex items-center justify-center"
              >
                <Share className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
