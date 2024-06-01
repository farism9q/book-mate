import { currentUser } from "@clerk/nextjs";
import { db } from "./db";
import { cache } from "react";
import { InitialUserType } from "@/types/initial-user";

export const initialUser = cache(async () => {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }
  const user = await db.user.findUnique({
    where: {
      userClerkId: clerkUser.id,
    },
    include: {
      userSettings: true,
      userProfileImage: true,
    },
  });

  if (user) {
    if (!user.userProfileImage?.imageUrl) {
      await db.user.update({
        where: {
          userClerkId: clerkUser.id,
        },
        data: {
          imageURL: clerkUser.imageUrl,
        },
      });
    }

    return {
      ...user,
      externalAccounts: !!clerkUser?.externalAccounts.length,
    };
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
}) as () => Promise<InitialUserType> | null;
