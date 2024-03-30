import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "./db";
import { User } from "@prisma/client";
import { cache } from "react";

export const initialUser = cache(async (): Promise<User> => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return redirectToSignIn();
  }
  const user = await db.user.findUnique({
    where: {
      userClerkId: clerkUser.id,
    },
  });

  if (user) {
    return await db.user.update({
      where: {
        userClerkId: clerkUser.id,
      },
      data: {
        email: clerkUser.emailAddresses[0].emailAddress,
        name: clerkUser.firstName + " " + clerkUser.lastName,
        imageURL: clerkUser.imageUrl,
      },
    });
  }

  const newUser = await db.user.create({
    data: {
      userClerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
      name: clerkUser.firstName + " " + clerkUser.lastName,
      imageURL: clerkUser.imageUrl,
    },
  });

  return newUser;
});
