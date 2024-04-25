"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export async function upsertChangelogReaction({
  changelogId,
  reaction,
  feedback,
}: {
  changelogId: string;
  reaction: boolean;
  feedback?: string;
}) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Not authenticated");
  }

  const changelogReaction = await db.changelogReaction.findFirst({
    where: {
      changelogId,
      userId,
    },
  });

  if (changelogReaction) {
    await db.changelogReaction.update({
      where: {
        id: changelogReaction.id,
      },
      data: {
        reaction,
        feedback,
      },
    });
  } else {
    await db.changelogReaction.create({
      data: {
        changelogId,
        userId,
        reaction,
        feedback,
      },
    });
  }

  revalidatePath(`/changelog`);
}
