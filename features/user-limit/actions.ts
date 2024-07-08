import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

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
