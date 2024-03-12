import { db } from "@/lib/db";
import { initialUser } from "@/lib/initial-user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await initialUser();

    const { bookId } = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!bookId) {
      return new NextResponse("Book ID is missing", { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: {
        id: user.id,
        favorites: {
          none: {
            bookId,
          },
        },
      },
      data: {
        favorites: {
          create: {
            bookId,
          },
        },
      },
    });

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.log("[POST_BOOK]", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
