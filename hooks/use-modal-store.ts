import { Book } from "@/types/book";
import { subscriptionType } from "@/types/subscription";
import { User, UserProfileImage } from "@prisma/client";
import { create } from "zustand";

export type ModalType =
  | "removeFavBook"
  | "upgradePlan"
  | "finishBook"
  | "editUserProfile"
  | "sendEmail"
  | "subscriptionSuccess";

interface ModalData {
  bookId?: string;
  favBookId?: string;
  finishedBooks?: Book[];
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
  onOpen: (type, data = { finishedBooks: [] }) => {
    if (type === "finishBook") {
      const oldData = get().data;
      const newData = {
        ...oldData,
        ...data,
        finishedBooks: [
          ...(oldData.finishedBooks || []),
          ...(data.finishedBooks || []),
        ],
      };

      return set({ isOpen: true, type, data: newData });
    }

    return set({ isOpen: true, type, data });
  },
  onClose: () => {
    // If modal type is finishBook, remove the first book from the list.
    // The modal will keep opening until the list is empty.
    if (get().type === "finishBook") {
      get().data.finishedBooks?.shift();

      if (get().data.finishedBooks?.length === 0) {
        return set({ type: null, isOpen: false });
      } else {
        return set({
          type: "finishBook",
          isOpen: true,
          data: { finishedBooks: get().data.finishedBooks },
        });
      }
    }
    return set({ type: null, isOpen: false });
  },
}));
