import { auth } from "@clerk/nextjs";

import { db } from "./db";
import { USER_FREE_LIMIT } from "@/constants";

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

export async function userHasFreeLimit() {
  const { userId } = auth();

  if (!userId) {
    return;
  }

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
