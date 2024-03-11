import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "./db";
import { User } from "@prisma/client";

export const initialUser = async (): Promise<User | null> => {
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
    return user;
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
};
