import { Book } from "@/types/book";
import { User, UserProfileImage } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "removeFavBook"
  | "upgradePlan"
  | "reviewBook"
  | "editUserProfile"
  | "sendEmail"
  | "subscriptionSuccess"
  | "userBooksPrefrences";

interface ModalData {
  bookId?: string;
  favBookId?: string;
  reviewBook?: {
    books: Book[];
    previousReview?: {
      reviewId: string;
      rating: number;
      review: string;
    };
  };
  user?: User & {
    externalAccounts: boolean;
    userProfileImage: UserProfileImage;
  };
  email?: {
    bookText: string;
    bookTitle: string;
    bookImageUrl: string;
    question?: string;
  };
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set, get) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (
    type,
    data = {
      reviewBook: {
        books: [],
      },
    }
  ) => {
    if (type === "reviewBook") {
      const oldData = get().data;
      const newData = {
        ...oldData,
        ...data,
        reviewBook: {
          previousReview: data.reviewBook?.previousReview,
          books: [
            ...(oldData.reviewBook?.books || []),
            ...(data.reviewBook?.books || []),
          ],
        },
      };

      return set({ isOpen: true, type, data: newData });
    }

    return set({ isOpen: true, type, data });
  },
  onClose: () => {
    // If modal type is reviewBook, remove the first book from the list.
    // The modal will keep opening until the list is empty.
    if (get().type === "reviewBook") {
      get().data.reviewBook?.books?.shift();

      if (get().data.reviewBook?.books?.length === 0) {
        return set({ type: null, isOpen: false });
      } else {
        return set({
          type: "reviewBook",
          isOpen: true,
          data: {
            reviewBook: {
              books: get().data.reviewBook?.books || [],
            },
          },
        });
      }
    }
    return set({ type: null, isOpen: false });
  },
}));
