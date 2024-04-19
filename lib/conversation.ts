import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export const createUpdateConversation = async (bookId: string) => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  let conversation = await db.conversation.findFirst({
    where: {
      bookId,
      userId,
    },
    include: {
      messages: true,
    },
  });

  // Since we are using soft delete, we need to update the conversation to undelete it
  if (conversation?.deleted) {
    return await db.conversation.update({
      where: {
        id: conversation.id,
      },
      data: {
        deleted: false,
        updatedAt: conversation.messages.at(-1)?.updatedAt || new Date(),
      },
    });
  }

  // If the conversation doesn't exist, create it
  if (!conversation) {
    return await db.conversation.create({
      data: {
        bookId,
        userId,
      },
    });
  }

  return conversation;
};
