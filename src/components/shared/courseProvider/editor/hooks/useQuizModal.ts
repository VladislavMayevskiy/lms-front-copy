import { create } from "zustand";

type QuizModalStore = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useQuizModal = create<QuizModalStore>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));