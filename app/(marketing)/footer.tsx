"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export const Footer = () => {
  return (
    <footer
      className="w-full h-20 py-4
    inset-x-0 top-0 z-30
    border-t border-zinc-800 bg-[#030813] backdrop-blur-lg"
    >
      <div className="flex items-center justify-center">
        <div
          className={cn(
            "group relative flex flex-col items-center space-y-2 rounded-lg p-px w-fit text-sm/6 text-zinc-400 hover:text-zinc-100 hover:shadow-glow"
          )}
        >
          <span className="text-gradient text-xs font-bold uppercase">
            Made with love by
          </span>{" "}
          <div className="relative flex items-center justify-center gap-x-2 z-10 rounded-lg bg-zinc-950 px-14 py-1.5 ring-1 ring-white/10">
            Faris
          </div>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-amber-400/0 via-amber-400/90 animate-ping transition-opacity duration-1000 group-hover:opacity-40" />
        </div>
      </div>
      <div className="px-4 lg:px-0 mx-auto flex h-full bg-[#030813] items-center justify-center gap-x-3">
        <Link href={"https://github.com/farism9q"} target="_blank">
          <Image
            src={"/github.svg"}
            alt="github"
            width={28}
            height={28}
            className="bg-white rounded-full hover:opacity-70 transition-all duration-300"
          />
        </Link>

        <Link
          href={"https://www.linkedin.com/in/faris-a-92a9a22ba"}
          target="_blank"
        >
          <Image
            src={"/linkedin.svg"}
            alt="linkedin"
            width={28}
            height={28}
            className="bg-white rounded-full border-none hover:opacity-70 transition-all duration-300"
          />
        </Link>

        <a href={"mailto:faris20ealqahtani@gmail.com"} target="_blank">
          <Image
            src={"/email.svg"}
            alt="email"
            width={28}
            height={28}
            className="bg-white rounded-full border-none hover:opacity-70 transition-all duration-300"
          />
        </a>
      </div>
    </footer>
  );
};
