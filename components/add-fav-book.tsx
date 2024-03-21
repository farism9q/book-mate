"use client";
import axios from "axios";
import qs from "query-string";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "./ui/button";
import { toast } from "sonner";

export interface AddBookProps {
  bookId: string;
}

export default function AddFavBook({ bookId }: AddBookProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onClick = async () => {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: "/api/add-fav-book",
      });
      toast.promise(axios.post(url, { bookId }), {
        loading: "Adding to favorite",
        success: "Added to favorite",
      });

      setIsLoading(false);
    } catch (err: any) {
      toast.error("Something went wrong");
    } finally {
      router.refresh();
    }
  };

  return (
    <div className="flex flex-col space-y-4 premium border-2 border-black rounded-lg p-3">
      <h3 className="uppercase text-white text-center text-3xl">
        Interested ?
      </h3>
      <div className="flex flex-col items-center justify-center space-y-6">
        <p className="text-zinc-100">
          Just click on save and start chatting with the book.
        </p>
        <Button disabled={isLoading} variant={"premium"} onClick={onClick}>
          Save
        </Button>
      </div>
    </div>
  );
}
