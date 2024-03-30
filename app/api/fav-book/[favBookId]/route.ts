import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { favBookId: string } }
) {
  try {
    const { userId } = auth();

    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.favBookId) {
      return new NextResponse("Favorite book id is missing", { status: 400 });
    }

    if (!bookId) {
      return new NextResponse("Book id is missing", { status: 400 });
    }

    const conversation = await db.conversation.findFirst({
      where: {
        bookId,
        userId,
      },
    });

    if (!conversation) {
      return new NextResponse("Conversation not found", { status: 404 });
    }

    const updatedUser = await db.user.update({
      where: {
        userClerkId: userId,
      },
      data: {
        conversations: {
          update: {
            where: {
              id: conversation.id,
              AND: [{ bookId }, { userId }],
            },
            data: {
              deleted: true,
            },
          },
        },
        favorites: {
          delete: {
            id: params.favBookId,
            bookId,
          },
        },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { favBookId: string } }
) {
  try {
    const { userId } = auth();

    const { status } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.favBookId) {
      return new NextResponse("Favorite book id is missing", { status: 400 });
    }

    if (!status) {
      return new NextResponse("Book's status is missing", { status: 400 });
    }

    const updatedFavBook = await db.favorite.update({
      where: {
        userId,
        id: params.favBookId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedFavBook);
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
