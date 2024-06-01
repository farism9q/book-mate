"use server";

import { db } from "@/lib/db";
import { getEmbedding } from "@/lib/openai";
import { conversationIndex } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

export async function saveUserChatgptConversationMessage({
  question,
  text,
  conversationId,
}: {
  question: string;
  text: string;
  conversationId: string;
}) {
  const { userId } = auth();

  if (!userId) throw Error("Not authenticated.");

  const questionEmbeddings = await getEmbedding(
    `Question: ${question}\nResponse: ${text}`
  );

  if (!questionEmbeddings) throw Error("Error generating embeddings.");

  await db.$transaction(
    async tx => {
      const updatedConversation = await tx.conversation.update({
        where: {
          id: conversationId,
        },
        data: {
          updatedAt: new Date(),
          messages: {
            create: {
              userQuestion: question,
              chatGPTResponse: text,
            },
          },
        },

        include: {
          messages: true,
        },
      });

      // Store the embeddings
      await conversationIndex.upsert([
        {
          id: updatedConversation.messages.at(-1)?.id!, // We store the message ID as the Pinecone ID. To become easy to retrieve later.
          values: questionEmbeddings,
          metadata: {
            userId,
            conversationId: updatedConversation.id,
          },
        },
      ]);
    },
    {
      maxWait: 5000, // default: 2000
      timeout: 10000, // default: 5000
    }
  );

  revalidatePath(`/book/${conversationId}/chat`);
}
