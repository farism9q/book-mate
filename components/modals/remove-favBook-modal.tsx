"use client";

import qs from "query-string";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const isModalOpen = isOpen && type === "removeFavBook";
  const { bookId, favBookId } = data;

  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/fav-book/${favBookId}`,
        query: {
          bookId,
        },
      });

      // Did not use toast.promise here because we want to disable the buttons (confirm and cancel) while the request is being made
      const toastLoaderId = toast.loading("Removing book from favorite");
      await axios.delete(url);
      toast.dismiss(toastLoaderId);

      toast.success("Book removed from favorite");

      onClose();
      router.refresh();
    } catch (error) {
      toast.error("Failed to remove book from favorite");
    } finally {
      setIsLoading(false);
    }
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
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
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
