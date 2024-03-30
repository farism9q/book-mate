import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { bookId, review, rating } = await req.json();

    if (!userId) {
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
        userId,
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
        userId,
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
        data: { userId, bookId, review, rating },
      });
    }

    return NextResponse.json(newReview);
  } catch (err) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
