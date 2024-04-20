"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { EntityAvatar } from "../entity-avatar";
import { Check, Copy, Share } from "lucide-react";
import { useModal } from "@/hooks/use-modal-store";

interface ChatItemProps {
  type: "user" | "chatgpt";
  text: string;
  avatar: string;
  bookTitle?: string;
  bookImageUrl?: string;
}

const ChatItem = ({
  type,
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
      className={cn(
        "group p-2",
        type === "user"
          ? "bg-zinc-600 dark:bg-primary/60 rounded-t-sm"
          : "bg-zinc-800 dark:bg-primary/20 rounded-b-sm"
      )}
    >
      <div className={"flex gap-2"}>
        <EntityAvatar
          src={avatar}
          alt={type === "user" ? "User avatar" : "ChatGPT avatar"}
          className="w-6 h-6 md:w-8 md:h-8"
        />
        <div className="relative w-full">
          <p className="text-white text-sm md:text-lg leading-relaxed pr-2 font-sans">
            {text}
          </p>

          {type === "chatgpt" && (
            <div className="absolute bottom-0 right-0 flex items-center gap-x-4">
              <button
                onClick={onCopy}
                className=" text-white md:hidden group-hover:flex "
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
                    },
                  });
                }}
                className=" text-white md:hidden group-hover:flex"
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
