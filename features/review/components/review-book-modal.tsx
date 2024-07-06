"use client";

import { useCreateReview } from "@/features/review/api/use-create-review";
import { useEditReview } from "@/features/review/api/use-edit-review";

import { useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import { useModal } from "@/hooks/use-modal-store";
import Confetti from "react-confetti";
import { toast } from "sonner";

import { cn, truncateTxt } from "@/lib/utils";

import { StarRating } from "../../../components/star-rating";
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

export const ReviewBookModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { width, height } = useWindowSize();

  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const books = data.reviewBook?.books;
  const previousReview = data.reviewBook?.previousReview;

  const { mutate: createReview, isLoading: isCreatingReview } =
    useCreateReview();

  const { mutate: editReview, isLoading: isEditingReview } = useEditReview(
    previousReview?.reviewId || ""
  );

  const isPending = isCreatingReview || isEditingReview;

  useEffect(() => {
    if (previousReview) {
      setRating(previousReview.rating);
      setReview(previousReview.review);
    }
  }, [previousReview]);

  const isModalOpen = isOpen && type === "reviewBook";

  if (!isModalOpen) return null;

  const onRatingChange = (value: number) => {
    setRating(value);
  };

  const currentFinishedBook = books?.length !== 0 ? books![0] : undefined;

  if (!currentFinishedBook) {
    onClose();
    return null;
  }

  // Number of review modals are currently opened
  const nbReviewsModal = books?.length;

  const onClick = async () => {
    if (!previousReview) {
      createReview(
        {
          review,
          rating,
          bookId: currentFinishedBook.id,
        },
        {
          onSuccess: () => {
            toast.success("Created review successfully");
            onClose();
            setReview("");
            setRating(5);
          },
        }
      );
    } else {
      editReview(
        {
          rating,
          review,
        },
        {
          onSuccess: () => {
            toast.success("Updated review successfully");
            onClose();
          },
        }
      );
    }
  };

  return (
    <Dialog
      open={isModalOpen}
      onOpenChange={() => {
        if (previousReview) {
          onClose();
        }
      }}
    >
      <DialogContent
        className={cn(
          "p-0 overflow-hidden",
          nbReviewsModal &&
            nbReviewsModal > 1 &&
            "shadow-[5px_5px_rgba(255,255,255,0.4),_10px_10px_rgba(255,255,255,0.3)] dark:shadow-[5px_5px_rgba(60,60,60,0.8),_10px_10px_rgba(60,60,60,0.7)]"
        )}
      >
        {!previousReview && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={500}
            tweenDuration={10000}
          />
        )}
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {!previousReview
              ? "Congratulations! You've finished the book."
              : "Update your review for:"}
            <span className="text-primary text-center line-clamp-1">
              {
                truncateTxt({
                  text: currentFinishedBook.volumeInfo.title,
                  nbChars: 30,
                }).text
              }
            </span>
          </DialogTitle>
          {!previousReview && (
            <DialogDescription className="text-center text-zinc-500">
              You can rate this book and write a review to share your thoughts
              with others.
            </DialogDescription>
          )}
        </DialogHeader>
        <DialogFooter className="px-6 py-4">
          <div className="grid w-full gap-x-2 gap-y-4">
            <StarRating
              disabled={isPending}
              currentRating={rating}
              onRatingChange={onRatingChange}
              nbStars={5}
            />
            <Textarea
              disabled={isPending}
              onChange={e => setReview(e.target.value)}
              value={review}
              placeholder="Type your review here..."
            />
            <Button disabled={isPending} onClick={onClick}>
              {!previousReview ? "Send review" : "Update review"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
