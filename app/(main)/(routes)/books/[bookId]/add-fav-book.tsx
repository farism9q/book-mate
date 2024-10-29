"use client";

import BookAction from "@/components/book-action";

export interface AddBookProps {
  onClick: () => void;
  isCreatingFavBook: boolean;
}

export default function AddFavBook({
  onClick,
  isCreatingFavBook,
}: AddBookProps) {
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
