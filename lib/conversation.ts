import { db } from "@/lib/db";
import { initialUser } from "@/lib/initial-user";
import { redirectToSignIn } from "@clerk/nextjs";
import { date } from "zod";

export const createUpdateConversation = async (bookId: string) => {
  const user = await initialUser();

  if (!user) {
    return redirectToSignIn();
  }

  let conversation = await db.conversation.findFirst({
    where: {
      bookId,
      userId: user.id,
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
        userId: user.id,
      },
    });
  }

  return conversation;
};
