import React, { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Category } from "@/constants";
import { useModal } from "@/hooks/use-modal-store";
import { useCreateUserBooksPrefrences } from "../api/use-create-books-prefrences";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const USER_BOOKS_GENRES = [
  Category.FICTION,
  Category.BUSINESS,
  Category.HISTORY,
  Category.SCIENCE,
  Category.SOCIAL,
  Category.RELIGION,
  Category.POLITICAL,
  Category.CRITICISM,
  Category.PSYCHOLOGY,
  Category.TECHNOLOGY,
  Category.PHILOSOPHY,
  Category.EDUCATION,
  Category.DRAMA,
  Category.FAMILY,
];

export const UserBooksPrefrencesModal = () => {
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const { onClose, isOpen, type } = useModal();

  const { mutate: createUserBooksPrefrences, isPending } =
    useCreateUserBooksPrefrences();

  console.log("I am being rendered");

  const toggleCategory = (category: Category) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleSave = () => {
    createUserBooksPrefrences(
      { categories: selectedCategories },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  const isModalOpen = type === "userBooksPrefrences" && isOpen;

  return (
    <Dialog open={isModalOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center uppercase font-semibold text-2xl text-gradient">
            Welcome to book mate!
          </DialogTitle>
          <DialogDescription className="text-center">
            Help us personalize your experience by selecting your favorite book
            genres.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4 sm:grid-cols-3">
          {USER_BOOKS_GENRES.map(category => (
            <Button
              key={category}
              onClick={() => toggleCategory(category)}
              variant={
                selectedCategories.includes(category) ? "default" : "outline"
              }
              className={`h-auto py-2 px-4 text-sm font-medium transition-colors ${
                selectedCategories.includes(category)
                  ? " text-white hover:"
                  : "  hover:"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>
        <DialogFooter>
          {isPending ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Providing you with best books...
            </Button>
          ) : (
            <Button onClick={handleSave}>Save Preferences</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
