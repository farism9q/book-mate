"use client";
import { useCreateFavBook } from "@/features/favorite-books/api/use-create-fav-book";

import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";

import { toast } from "sonner";

import { ErrorType } from "@/constants";

import BookAction from "@/components/book-action";

export interface AddBookProps {
  bookId: string;
}

export default function AddFavBook({ bookId }: AddBookProps) {
  const { onOpen } = useModal();
  const router = useRouter();

  const { mutate: createFavBook, isPending: isCreatingFavBook } =
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
    <BookAction
      title="Interested ?"
      description="Just click on save and start chatting with the book."
      isLoading={isCreatingFavBook}
      btnLabel="Save"
      onClick={onClick}
    />
  );
}
