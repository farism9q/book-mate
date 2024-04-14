"use client";
import axios from "axios";
import qs from "query-string";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "./ui/button";
import { toast } from "sonner";
import { ErrorType } from "@/constants";
import { useModal } from "@/hooks/use-modal-store";

export interface AddBookProps {
  bookId: string;
}

export default function AddFavBook({ bookId }: AddBookProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { onOpen } = useModal();
  const router = useRouter();
  const onClick = async () => {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: "/api/fav-book",
      });

      toast.promise(axios.post(url, { bookId }), {
        loading: "Adding to favorite",
        success(data) {
          router.push(`/book/${bookId}/chat`);
          router.refresh();
          return "Added to favorite";
        },
        error(error) {
          if (
            error?.response?.status === 403 &&
            error.response.data?.type === ErrorType.ALREADY_FAV
          ) {
            router.push(`/books/${bookId}`);
            router.refresh();
            return "Already added as favorite";
          }
          if (
            error?.response?.status === 403 &&
            error.response.data?.type === ErrorType.UPGRADE_PLAN
          ) {
            onOpen("upgradePlan");
            return "You need to upgrade";
          }

          return "Something went wrong";
        },
        finally() {
          setIsLoading(false);
        },
      });
    } catch (err: any) {
      toast.error("Something went wrong");
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
