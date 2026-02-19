import { create } from "zustand";

type QuizDeleteModal = {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

export const useQuizDeleteModal = create<QuizDeleteModal>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
}));