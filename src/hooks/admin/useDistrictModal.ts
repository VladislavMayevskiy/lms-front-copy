import { create } from "zustand";

type ModalStore = {
  isOpen: boolean;
  toggleModal: () => void;
  openModal: () => void;
  closeModal: () => void;
};

export const useDistrictModal = create<ModalStore>((set) => ({
  isOpen: false,
  toggleModal: () => set(({ isOpen }) => ({ isOpen: !isOpen })),
  openModal: () => set(() => ({ isOpen: true })),
  closeModal: () => set(() => ({ isOpen: false })),
}));