import { create } from "zustand";

type AddContentModalStore = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useAddContentModal = create<AddContentModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));