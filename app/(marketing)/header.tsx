"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { Menu } from "lucide-react";
import Link from "next/link";
import { ClerkButtonState } from "./clerk-button-state";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Features",
    href: "/#features",
  },
  {
    title: "Pricing",
    href: "/#pricing",
  },
  {
    title: "Changelog",
    href: "/changelog",
  },
];

type Props = {
  isNewUpdate: boolean;
};

export const Header = ({ isNewUpdate }: Props) => {
  return (
    <header className="w-full h-16 inset-x-0 top-0 z-30 transition-all duration-300 sticky border-b border-zinc-800 bg-zinc-950/75 backdrop-blur-lg">
      <div className="lg:w-[950px] px-4 lg:px-0 mx-auto flex items-center justify-between h-full">
        <div className="flex items-center gap-x-10">
          <h1 className="text-gradient text-2xl md:text-4xl font-bold uppercase tracking-widest">
            Book mate
          </h1>

          <nav className="hidden md:flex items-center gap-x-4">
            {navItems.map(item => (
              <a
                key={item.title}
                href={item.href}
                className={cn(
                  "text-sm font-medium text-[#727E8E] hover:text-white transition-all duration-300",
                  item.title === "Changelog" && isNewUpdate && "relative"
                )}
              >
                {item.title === "Changelog" && isNewUpdate && (
                  <div className="flex items-center justify-center absolute w-[22px] h-[14px] rounded-full -right-[30%] -top-[30%] -z-50 text-[8px] bg-sky-500 text-sky-100">
                    <p>New</p>
                  </div>
                )}
                {item.title}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-x-2">
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
                  <Button variant={"header"}>Sign in</Button>
                </SignInButton>
              </SignedOut>
            }
          />

          <Sheet>
            <SheetTrigger className="md:hidden">
              <Menu className="w-6 h-6 text-muted-foreground" />
            </SheetTrigger>
            <SheetContent side={"top"} className="bg-zinc-900 border-none">
              <nav className="flex flex-col items-center justify-center gap-y-4 py-20">
                {navItems.map(item => (
                  <a
                    key={item.title}
                    href={item.href}
                    className={cn(
                      "text-2xl font-medium text-muted-foreground hover:text-white transition-all duration-300",
                      item.title === "Changelog" && isNewUpdate && "relative"
                    )}
                  >
                    {item.title === "Changelog" && isNewUpdate && (
                      <div className="flex items-center justify-center absolute w-[22px] h-[14px] rounded-full -right-[17%] -top-[17%] -z-50 text-[8px] bg-sky-500 text-sky-100">
                        <p>New</p>
                      </div>
                    )}
                    {item.title}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
