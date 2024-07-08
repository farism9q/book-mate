import { auth } from "@clerk/nextjs";

import { db } from "./db";
import { CHAT_LIMIT_PER_BOOK, USER_FREE_LIMIT } from "@/constants";

export async function userChatLimits({
  conversationId,
}: {
  conversationId?: string;
}) {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  if (!conversationId) {
    return 0;
  }

  const bookChatCounts = await db.message.findMany({
    where: {
      conversationId,
    },
    take: 5,
  });

  return bookChatCounts.length;
}

// This is used by two different routes. Move this function to a separate file.
export async function userHasFreeLimit({
  type,
  conversationId,
}: {
  type: "addFavBook" | "bookChat";
  conversationId?: string;
}) {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  if (type === "addFavBook") {
    const userLimit = await db.userLimit.findUnique({
      where: {
        userId,
      },
    });

    if (!userLimit || userLimit.count < USER_FREE_LIMIT) {
      return true;
    }

    return false;
  }

  if (type === "bookChat") {
    const bookChats = await userChatLimits({ conversationId });

    if (!bookChats) {
      return true;
    }

    return bookChats < CHAT_LIMIT_PER_BOOK;
  }
}
