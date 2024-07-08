"use server";
import { auth } from "@clerk/nextjs";

import { db } from "./db";

const DAY_IN_MS = 86_400_00;

export async function checkSubscription() {
  const { userId } = auth();

  if (!userId) {
    return false;
  }
  const userSubscription = await db.userSubscription.findFirst({
    where: { userId },
    select: {
      type: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      stripePriceId: true,
    },
  });

  if (!userSubscription) {
    return false;
  }

  const isValid =
    userSubscription.type === "PRODUCTION" &&
    userSubscription.stripePriceId &&
    userSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS >
      Date.now();

  //  (!!) to ensure it's return always boolean
  return !!isValid;
}
