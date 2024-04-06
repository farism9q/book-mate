import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "./db";
import { cache } from "react";

export const initialUser = cache(async () => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return redirectToSignIn();
  }
  const user = await db.user.findUnique({
    where: {
      userClerkId: clerkUser.id,
    },
    include: {
      userSettings: true,
    },
  });

  if (user) {
    return { ...user, externalAccounts: !!clerkUser?.externalAccounts.length };
  }

  const newUser = await db.user.create({
    data: {
      userClerkId: clerkUser.id,
      email: clerkUser.emailAddresses[0].emailAddress,
      name: clerkUser.firstName + " " + clerkUser.lastName,
      imageURL: clerkUser.imageUrl,
      bio: "Nothing...",
      userSettings: {
        create: {
          allowBooksVisibliity: false,
        },
      },
    },
    include: {
      userSettings: true,
    },
  });

  return { ...newUser, externalAccounts: !!clerkUser?.externalAccounts.length };
});
