import { Check } from "lucide-react";
import { UpgradeButton } from "./upgrade-button";
import { ClerkButtonState } from "./clerk-button-state";
import { Button } from "@/components/ui/button";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";

type Props = {
  plan: "Basic" | "Pro";
  price: string;
  pricePerUnit?: string;
  features: string[];
  isSubscribed?: boolean;
};

export const PriceCard = ({
  plan,
  price,
  pricePerUnit,
  features,
  isSubscribed,
}: Props) => {
  return (
    <div className="relative w-[300px] border rounded-md hover:border-amber-500/30 transition-all duration-300 rounded-r-3xl rounded-l-2xl shadow-2xl">
      <div className="py-6 px-12 flex flex-col justify-between w-full h-full relative">
        <div className="py-6 flex flex-col gap-y-6 snap-center md:snap-none h-full md:snap-align-none backdrop-blur-sm border-white/20 z-20">
          <h3 className="text-lg font-medium text-amber-200">{plan}</h3>
          <h2 className="text-4xl font-semibold text-amber-500">
            {price}
            {pricePerUnit && (
              <span className="text-amber-200 text-sm font-medium">
                {pricePerUnit}
              </span>
            )}
          </h2>

          {features.map(feature => (
            <div key={feature} className="flex items-center gap-2">
              <Check className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-amber-200">{feature}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center w-full">
          {plan === "Basic" && (
            <ClerkButtonState
              signIn={
                <SignedIn>
                  <Link href="/books">
                    <Button variant={"header"}>Browse Books</Button>
                  </Link>
                </SignedIn>
              }
              signOut={
                <SignedOut>
                  <SignInButton
                    mode="modal"
                    afterSignInUrl="/books"
                    afterSignUpUrl="/books"
                  >
                    <Button variant={"header"}>Get started</Button>
                  </SignInButton>
                </SignedOut>
              }
            />
          )}
          {plan === "Pro" && (
            <ClerkButtonState
              signIn={
                <SignedIn>
                  {isSubscribed ? (
                    <Button className="bg-amber-500/15 text-amber-500 border-amber-500/70 border-2 hover:bg-amber-500/20 transition-none">
                      <Link href="/books">You're subscribed! Browse Books</Link>
                    </Button>
                  ) : (
                    <UpgradeButton />
                  )}
                </SignedIn>
              }
              signOut={
                <SignedOut>
                  <SignInButton
                    mode="modal"
                    afterSignInUrl="/books"
                    afterSignUpUrl="/books"
                  >
                    <Button variant={"premium"}>
                      Get started to subscribe
                    </Button>
                  </SignInButton>
                </SignedOut>
              }
            />
          )}
        </div>
      </div>
    </div>
  );
};
