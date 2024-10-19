"use server";

import { Book } from "@/types/book";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { conversationIndex } from "@/lib/pinecone";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { streamText } from "ai";

import { openai as openaisdk } from "@ai-sdk/openai";
import { createStreamableValue } from "ai/rsc";
import { getEmbedding } from "@/lib/openai";
import { userHasFreeLimit } from "@/lib/user-limit";
import { ErrorType } from "@/constants";
import { checkSubscription } from "@/lib/user-subscription";

import axios from "axios";

async function urlToBase64(url: string) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  const buffer = Buffer.from(response.data, "binary");
  return buffer.toString("base64");
}

export async function askQuestion({
  book,
  previousChats,
  question,
  conversationId,
}: {
  question: {
    text: string;
    urls?: string[];
  };
  book: Book;
  previousChats: { role: string; content: string }[];
  conversationId: string;
}) {
  try {
    const { userId } = auth();

    const isFreeLimit = await userHasFreeLimit({
      type: "bookChat",
      conversationId,
    });
    const isSubscribed = await checkSubscription();

    if (!isFreeLimit && !isSubscribed) {
      return {
        message: "Upgrade your plan to send more questions",
        type: ErrorType.UPGRADE_PLAN,
      };
    }

    const previousQuestionEmbeddings = await getEmbedding(
      previousChats.map(chat => chat.content).join("\n")
    );

    // - This is going to retrieve number of messages that we specified in "topK"
    const vectorQueryResponse = await conversationIndex.query({
      vector: previousQuestionEmbeddings,
      topK: 10, // number of messages to retrieve
      filter: { userId, conversationId },
    });

    const relevant = await db.message.findMany({
      where: {
        id: {
          in: vectorQueryResponse.matches.map(match => match.id),
        },
      },
    });

    const conversationHistory = relevant
      .map(r => `Question: ${r.userQuestion}\nResponse:${r.chatGPTResponse}`)
      .join("\n");

    const instructionMessage: ChatCompletionMessageParam = {
      role: "system",
      content: `You are an assistant designed to provide information from the book titled "${book.volumeInfo.title}". Here are some details about the book:
      - Author(s): ${book.volumeInfo.authors}
      - Published on: ${book.volumeInfo.publishedDate}
      - Publisher: ${book.volumeInfo.publisher}
      
      Please use this context to answer questions related to the book. If the user's new question is unrelated to the previous conversation, treat it as a new interaction and respond accordingly.
      
      Conversation context (use this if the question is related to it):
      ${conversationHistory}
      `,
    };

    let urls: undefined | any[] = undefined;
    if (question.urls && question.urls?.length > 0) {
      const urlsType = question.urls?.map(async url => {
        const base64 = await urlToBase64(url);
        return {
          type: "image",
          image: base64,
        };
      });

      urls = await Promise.all(urlsType);
    }

    const result = await streamText({
      model: openaisdk("gpt-4o") as any,
      messages: [
        instructionMessage,
        {
          role: "user",
          content: [
            {
              type: "text",
              text: question.text,
            },

            ...(urls || []),
          ],
        },
      ],
    });

    const stream = createStreamableValue(result.textStream);

    return stream.value;
  } catch (error) {
    throw Error("Error generating response.");
  }
}
