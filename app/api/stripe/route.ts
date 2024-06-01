import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth, currentUser } from "@clerk/nextjs";

import { db } from "@/lib/db";

const url = process.env.PUBLIC_ABSOLUTE_URL;

export async function GET() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userSubscription = await db.userSubscription.findFirst({
      where: {
        userId,
      },
    });

    // The user is already subscriped. Navigate to billing protal, so he can manage his subscription
    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: `${url}/books?subscription=update`,
      });

      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    // First time subscription:
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${url}/books?subscription=subscribe`,
      cancel_url: url,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price_data: {
            currency: "SAR",
            product_data: {
              name: "Book Mate Premium",
              description: "Unlimited books with chatting feature",
            },
            unit_amount: 1500,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId, // This is important and will be used in the webhook to know the subscriped user id, otherwise we don't have a way to know who just subscriped, because we are in different application and not in our application
      },
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  } catch (err) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
