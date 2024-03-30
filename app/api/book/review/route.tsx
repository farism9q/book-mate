import { db } from "@/lib/db";
import { initialUser } from "@/lib/initial-user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await initialUser();
    const { bookId, review, rating } = await req.json();

    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!bookId) {
      return new NextResponse("Missing book id", { status: 400 });
    }

    if (!rating) {
      return new NextResponse("Missing rating", { status: 400 });
    }

    const userFavoriteBook = await db.favorite.findFirst({
      where: {
        userId: user.id,
        bookId,
      },
    });

    if (!userFavoriteBook) {
      return new NextResponse("Book is not in the user's favorite list.", {
        status: 404,
      });
    }

    const existingReview = await db.review.findFirst({
      where: {
        userId: user.id,
        bookId,
      },
    });

    let newReview;

    if (existingReview) {
      // Update the existing review
      newReview = await db.review.update({
        where: { id: existingReview.id },
        data: { review, rating },
      });
    } else {
      // Insert a new review
      newReview = await db.review.create({
        data: { userId: user.id, bookId, review, rating },
      });
    }

    return NextResponse.json(newReview);
  } catch (err) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
