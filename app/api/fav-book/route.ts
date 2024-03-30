import { NextResponse } from "next/server";

import { ErrorType } from "@/constants";
import { db } from "@/lib/db";
import { increaseUserLimit, userHasFreeLimit } from "@/lib/user-limit";
import { checkSubscription } from "@/lib/user-subscription";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    const { bookId } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!bookId) {
      return new NextResponse("Book ID is missing", { status: 400 });
    }

    const isAlreadyFav = await db.favorite.findFirst({
      where: {
        userId,
        bookId,
      },
    });

    if (isAlreadyFav) {
      return new NextResponse(
        JSON.stringify({
          message: "The book is already in your favorite book list",
          type: ErrorType.ALREADY_FAV,
        }),
        { status: 403 }
      );
    }

    const isFreeLimit = await userHasFreeLimit({ type: "addFavBook" });
    const isSubscribed = await checkSubscription();

    if (!isFreeLimit && !isSubscribed) {
      return new NextResponse(
        JSON.stringify({
          message: "Upgrade your plan to add more books",
          type: ErrorType.UPGRADE_PLAN,
        }),
        {
          status: 403,
        }
      );
    }

    const updatedUser = await db.user.update({
      where: {
        userClerkId: userId,
      },
      data: {
        favorites: {
          create: {
            bookId,
          },
        },
      },
    });

    if (!isSubscribed) {
      await increaseUserLimit();
    }

    return NextResponse.json(updatedUser);
  } catch (err) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
