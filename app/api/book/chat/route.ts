import { NextResponse } from "next/server";
import OpenAi from "openai";

import { db } from "@/lib/db";
import { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import { BookInfoForChatGPT } from "@/types/book";
import { userHasFreeLimit } from "@/lib/user-limit";
import { ErrorType } from "@/constants";
import { checkSubscription } from "@/lib/user-subscription";

const openai = new OpenAi({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const question = body.question;
    const book = body.book as BookInfoForChatGPT;
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return new NextResponse("User ID is missing", { status: 400 });
    }

    if (!book) {
      return new NextResponse("Book Info is missing", { status: 400 });
    }
    if (!question) {
      return new NextResponse("No question was provided", { status: 400 });
    }

    let conversation = await db.conversation.findFirst({
      where: {
        AND: [
          {
            bookId: book.id,
          },
          {
            userId,
          },
        ],
      },
    });

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    const isFreeLimit = await userHasFreeLimit({
      type: "bookChat",
      conversationId: conversation.id,
    });
    const isSubscribed = await checkSubscription();

    if (!isFreeLimit && !isSubscribed) {
      return new NextResponse(
        JSON.stringify({
          message: "Upgrade your plan to send more questions",
          type: ErrorType.UPGRADE_PLAN,
        }),
        {
          status: 403,
        }
      );
    }

    const instructionMessage: ChatCompletionMessageParam = {
      role: "assistant",
      content: `You are a system that wants to give an answer from the ${book.title} book. Few information about the the book: Written by: ${book.authors}, published on: ${book.publishedDate}, the publisher: ${book.publisher}. You can use the book's information to answer the user's question.`,
    };

    const userQuestion: ChatCompletionMessageParam = {
      role: "user",
      content: question,
    };

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [instructionMessage, userQuestion],
    });

    const responseMessage = response.choices[0].message;

    const updatedConversation = await db.conversation.update({
      where: {
        id: conversation.id,
      },
      data: {
        updatedAt: new Date(),
        messages: {
          create: {
            userQuestion: question,
            chatGPTResponse: responseMessage.content as string,
          },
        },
      },

      include: {
        messages: true,
      },
    });

    const message =
      updatedConversation.messages[updatedConversation.messages.length - 1];

    return NextResponse.json(message);
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
