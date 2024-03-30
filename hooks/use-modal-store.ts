import { Book } from "@/types";
import { create } from "zustand";

export type ModalType = "removeFavBook" | "upgradePlan" | "finishBook";

interface ModalData {
  bookId?: string;
  favBookId?: string;
  finishedBooks?: Book[];
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
