import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { Message } from "@prisma/client";
import { NextResponse } from "next/server";

const MESSAGES_BATCH_SIZE = 10;

export async function GET(
  req: Request,
  { params }: { params: { conversationId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor");

    let messages: Message[];

    const conversation = await db.conversation.findFirst({
      where: {
        id: params.conversationId,
        userId,
        deleted: false,
      },
    });

    // There might be no conversationId if the user hasn't started a conversation yet
    if (!conversation) {
      return NextResponse.json({ messages: [], nextCursor: null });
    }

    if (cursor) {
      messages = await db.message.findMany({
        where: {
          conversationId: params.conversationId,
        },
        take: MESSAGES_BATCH_SIZE,
        skip: 1,
        cursor: {
          id: cursor,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    } else {
      messages = await db.message.findMany({
        where: {
          conversationId: params.conversationId,
        },
        take: MESSAGES_BATCH_SIZE,
        orderBy: {
          createdAt: "desc",
        },
      });
    }

    let nextCursor = null;

    if (messages.length === MESSAGES_BATCH_SIZE) {
      nextCursor = messages[messages.length - 1].id;
    }

    return NextResponse.json({
      messages,
      nextCursor,
    });
  } catch (err) {
    return new NextResponse("INTERNAL ERROR", { status: 500 });
  }
}
