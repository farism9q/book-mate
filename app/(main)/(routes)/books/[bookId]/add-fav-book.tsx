"use client";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { useCreateFavBook } from "@/features/favorite-books/api/use-create-fav-book";

import { ErrorType } from "@/constants";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export interface AddBookProps {
  bookId: string;
}

export default function AddFavBook({ bookId }: AddBookProps) {
  const { onOpen } = useModal();
  const router = useRouter();

  const { mutate: createFavBook, isLoading: isCreatingFavBook } =
    useCreateFavBook();

  const onClick = async () => {
    toast.loading("Adding to favorite");
    createFavBook(
      { bookId },
      {
        onSuccess(data) {
          if ("type" in data && data.type === ErrorType.ALREADY_FAV) {
            toast.error(data.message);
            router.push(`/books/${bookId}`);
            return;
          }
          if ("type" in data && data.type === ErrorType.UPGRADE_PLAN) {
            toast.error(data.message);
            onOpen("upgradePlan");
            return;
          }

          toast.success("Added to favorite");
          router.push(`/book/${bookId}/conversation`);
        },
        onSettled() {
          toast.dismiss();
        },
      }
    );
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
        <Button
          disabled={isCreatingFavBook}
          variant={"premium"}
          onClick={onClick}
        >
          Save
        </Button>
      </div>
    </div>
  );
}
