import { Message } from "@prisma/client";

const INCLUDE_LAST_MESSAGES = 4;

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
