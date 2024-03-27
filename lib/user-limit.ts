import { auth } from "@clerk/nextjs";

import { db } from "./db";
import { CHAT_LIMIT_PER_BOOK, USER_FREE_LIMIT } from "@/constants";

export async function increaseUserLimit() {
  const { userId } = auth();

  if (!userId) {
    return;
  }

  const userLimit = await db.userLimit.findUnique({
    where: {
      userId,
    },
  });

  // If userLimit is not found, create a new record. Otherwise, update the count.
  if (!userLimit) {
    await db.userLimit.create({
      data: {
        userId,
        count: 1,
      },
    });
  } else {
    await db.userLimit.update({
      where: {
        userId,
      },
      data: {
        count: userLimit.count + 1,
      },
    });
  }
}

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

export async function userLimitCount() {
  const { userId } = auth();

  if (!userId) {
    return 0;
  }

  const userLimit = await db.userLimit.findUnique({
    where: {
      userId,
    },
  });

  if (!userLimit) {
    return 0;
  }

  return userLimit.count;
}
