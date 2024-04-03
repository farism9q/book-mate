// Clerk images are not currently supported. Please consult the API documentation for more information.

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import { UserAccountUpdate } from "@/types/user-account";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    const { clerkUpdateFields, userUpdateFields }: UserAccountUpdate =
      await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const clerkUserPromise = clerkClient.users.updateUser(userId, {
      firstName: clerkUpdateFields.firstName,
      lastName: clerkUpdateFields.lastName,
    });

    let verifiedPasswordPromise, userAvatarPromise;

    if (clerkUpdateFields.currentPassword && clerkUpdateFields.newPassword) {
      verifiedPasswordPromise = clerkClient.users.verifyPassword({
        userId,
        password: clerkUpdateFields.currentPassword,
      });
    }

    const [clerkUser, verifiedPassword] = await Promise.allSettled([
      clerkUserPromise,
      verifiedPasswordPromise,
    ]);

    let updatedUser;
    if (clerkUser.status === "fulfilled") {
      updatedUser = await db.user.update({
        where: {
          userClerkId: userId,
        },

        data: {
          name: clerkUser.value.firstName + " " + clerkUser.value.lastName,
          bio: userUpdateFields.bio,
          imageURL: clerkUpdateFields.avatar,
        },
      });
    }

    if (verifiedPassword.status === "fulfilled") {
      await clerkClient.users.updateUser(userId, {
        password: clerkUpdateFields.newPassword,
      });
    }

    if (verifiedPassword.status === "rejected") {
      return new NextResponse(
        JSON.stringify({
          errors: verifiedPassword.reason.errors,
          clerkError: true,
        })
      );
    }

    if (clerkUser.status === "rejected") {
      return new NextResponse(
        JSON.stringify({
          errors: clerkUser.reason.errors,
          clerkError: true,
        })
      );
    }

    return NextResponse.json(updatedUser);
  } catch (err: any) {
    if (err.clerkError) {
      return new NextResponse(
        JSON.stringify({
          errors: err.errors,
          clerkError: true,
        })
      );
    }
    return new NextResponse("Failed to update user");
  }
}
