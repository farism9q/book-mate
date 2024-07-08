"use client";

import { Button } from "@/components/ui/button";

export interface AddBookProps {
  title: string;
  description: string;
  isLoading?: boolean;
  btnLabel: string;
  onClick: () => void;
}

export default function BookAction({
  title,
  description,
  isLoading,
  btnLabel,
  onClick,
}: AddBookProps) {
  return (
    <div className="flex flex-col space-y-4 primary p-3 bg-gradient-to-b from-zinc-200 to-zinc-500">
      <h3 className="uppercase text-zinc-800 text-center text-3xl">{title}</h3>
      <div className="flex flex-col items-center justify-center space-y-6">
        <p className="text-zinc-700">{description}</p>
        <Button
          disabled={isLoading}
          variant={"primary"}
          size={"lg"}
          onClick={onClick}
        >
          {btnLabel}
        </Button>
      </div>
    </div>
  );
}
