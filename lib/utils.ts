import { Message } from "@prisma/client";
import { type ClassValue, clsx } from "clsx";
import { isAfter, subDays } from "date-fns";
import { twMerge } from "tailwind-merge";

const INCLUDE_LAST_MESSAGES = 4;

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractCategories(categories: string[]) {
  return Array.from(
    new Set(categories?.join(" / ").split(" / ").join(" & ").split(" & "))
  );
}

export function truncateTxt({
  text,
  nbChars,
}: {
  text: string;
  nbChars: number;
}) {
  if (text.length > nbChars) {
    return { text: text.substring(0, nbChars) + "...", isTruncated: true };
  } else {
    return { text, isTruncated: false };
  }
}

export function isNewUpdate(updateDate?: Date) {
  if (!updateDate) return false;

  const dateThreshold = subDays(new Date(), 30);

  return isAfter(new Date(updateDate), dateThreshold);
}

export function formatMessages(
  messages: Message[]
): { role: string; content: string }[] {
  const formattedPreviousMessages = messages
    ?.slice(0, INCLUDE_LAST_MESSAGES)
    .map((message: Message) => {
      return [
        {
          role: "user",
          content: message.userQuestion,
        },
        {
          role: "system",
          content: message.chatGPTResponse,
        },
      ];
    })
    .flat();

  return formattedPreviousMessages;
}
