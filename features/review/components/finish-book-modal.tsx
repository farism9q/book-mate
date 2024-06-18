"use client";

import { useCreateReview } from "@/features/review/api/use-create-review";

import { useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { StarRating } from "./StarRating";
import { cn, truncateTxt } from "@/lib/utils";

export const FinishBookModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { width, height } = useWindowSize();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const { mutate: createReview, isLoading: isCreatingReview } =
    useCreateReview();

  const isModalOpen = isOpen && type === "finishBook";

  if (!isModalOpen) return null;

  const onRatingChange = (value: number) => {
    setRating(value);
  };

  const { finishedBooks } = data;

  const currentFinishedBook =
    finishedBooks?.length !== 0 ? finishedBooks![0] : undefined;

  if (!currentFinishedBook) {
    onClose();
    return null;
  }

  // Number of review modals are currently opened
  const nbReviewsModal = finishedBooks?.length;

  const onClick = async () => {
    createReview(
      {
        review,
        rating,
        bookId: currentFinishedBook.id,
      },
      {
        onSuccess: () => {
          toast.success("Updated review successfully");
          onClose();
          setReview("");
          setRating(5);
        },
      }
    );
  };

  return (
    <Dialog open={isModalOpen}>
      <DialogContent
        className={cn(
          "p-0 overflow-hidden",
          nbReviewsModal &&
            nbReviewsModal > 1 &&
            "shadow-[5px_5px_rgba(255,255,255,0.4),_10px_10px_rgba(255,255,255,0.3)] dark:shadow-[5px_5px_rgba(60,60,60,0.8),_10px_10px_rgba(60,60,60,0.7)]"
        )}
      >
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          tweenDuration={10000}
        />
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Congratulations! You&apos;ve finished the book.
            <span className="text-primary text-center line-clamp-1">
              {
                truncateTxt({
                  text: currentFinishedBook.volumeInfo.title,
                  nbChars: 30,
                }).text
              }
            </span>
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            You can rate this book and write a review to share your thoughts
            with others.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="px-6 py-4">
          <div className="grid w-full gap-x-2 gap-y-4">
            <StarRating
              disabled={isCreatingReview}
              currentRating={rating}
              onRatingChange={onRatingChange}
              nbStars={5}
            />
            <Textarea
              disabled={isCreatingReview}
              onChange={e => setReview(e.target.value)}
              value={review}
              placeholder="Type your review here..."
            />
            <Button disabled={isCreatingReview} onClick={onClick}>
              Send review
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};