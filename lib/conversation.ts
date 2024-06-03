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
      deleted: false,
    },
    include: {
      messages: true,
    },
  });


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
