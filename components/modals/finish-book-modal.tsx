"use client";

import { useState } from "react";
import axios from "axios";
import qs from "query-string";
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
import { Textarea } from "../ui/textarea";
import { StarRating } from "../StarRating";
import { useRouter } from "next/navigation";
import { truncateTxt } from "@/lib/utils";

export const FinishBookModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { width, height } = useWindowSize();
  const router = useRouter();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);
  const [isLoading, setIsLoading] = useState(false);

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

  const onClick = async () => {
    try {
      setIsLoading(true);
      const url = qs.stringifyUrl({
        url: `/api/book/review`,
      });

      await axios.post(url, {
        review,
        rating,
        bookId: currentFinishedBook.id,
      });

      toast.success("Updated review successfully");

      onClose();
      setReview("");
      setRating(5);
      router.refresh();
    } catch (error) {
      toast.error("Failed to reivew the book");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={500}
        tweenDuration={10000}
      />
      <Dialog open={isModalOpen}>
        <DialogContent className="p-0 overflow-hidden">
          <DialogHeader className="pt-8 px-6">
            <DialogTitle className="text-2xl text-center font-bold">
              Congratulations! You&apos;ve finished the book.
              <span className="text-primary text-center line-clamp-1">
                {truncateTxt({
                  text: currentFinishedBook.volumeInfo.title,
                  nbChars: 30,
                })}
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
                disabled={isLoading}
                currentRating={rating}
                onRatingChange={onRatingChange}
                nbStars={5}
              />
              <Textarea
                disabled={isLoading}
                onChange={e => setReview(e.target.value)}
                value={review}
                placeholder="Type your review here..."
              />
              <Button disabled={isLoading} onClick={onClick}>
                Send review
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
