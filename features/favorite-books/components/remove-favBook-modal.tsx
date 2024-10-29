"use client";

import { useDeleteFavBook } from "@/features/favorite-books/api/use-delete-fav-book";

import { useModal } from "@/hooks/use-modal-store";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export const RemoveFavoriteBookModal = () => {
  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === "removeFavBook";
  const { bookId, favBookId } = data;

  const { mutate: deleteFavBook, isPending: isDeleteFavBookLoading } =
    useDeleteFavBook();

  const onClick = async () => {
    if (!favBookId || !bookId) return;

    toast.loading("Removing book from favorite");
    deleteFavBook(
      {
        bookId,
        favBookId,
      },
      {
        onSuccess: () => {
          toast.success("Book removed from favorite");
          onClose();
        },

        onSettled: () => {
          toast.dismiss();
        },
      }
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Remove Favorite book
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />
            Both the <span className="text-primary font-semibold">
              book
            </span>{" "}
            and the{" "}
            <span className="text-primary font-semibold">conversation</span>{" "}
            will be deleted.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button
              disabled={isDeleteFavBookLoading}
              onClick={onClose}
              variant="ghost"
            >
              Cancel
            </Button>
            <Button
              disabled={isDeleteFavBookLoading}
              variant="destructive"
              onClick={onClick}
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
