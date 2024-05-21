import { Book } from "@/types/book";
import { User, UserProfileImage } from "@prisma/client";
import { create } from "zustand";

interface SheetData {
  user?: User & { externalAccounts: boolean; profileImage: UserProfileImage };
}

interface SheetStore {
  data: SheetData;
  isOpen: boolean;
  onOpen: (data?: SheetData) => void;
  onClose: () => void;
}

export const useEditProfileSheet = create<SheetStore>(set => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: data => set({ isOpen: true, data }),
  onClose: () => set({ isOpen: false, data: {} }),
}));
