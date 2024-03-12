import { db } from "@/lib/db";
import { initialUser } from "@/lib/initial-user";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { favBookId: string } }
) {
  try {
    const user = await initialUser();

    const { searchParams } = new URL(req.url);
    const bookId = searchParams.get("bookId");

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.favBookId) {
      return new NextResponse("Favorite book id is missing", { status: 400 });
    }

    if (!bookId) {
      return new NextResponse("Book id is missing", { status: 400 });
    }

    const updatedUser = await db.user.update({
      where: {
        id: user.id,
      },
      data: {
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
    console.log("DELETE_FAV_BOOK", err);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
