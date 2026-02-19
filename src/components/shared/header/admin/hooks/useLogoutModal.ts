import { create } from "zustand";

type LogoutModalStore = {
  isOpen: boolean;
  toggleModal: () => void;
};

export const useLogoutModal = create<LogoutModalStore>((set) => ({
  isOpen: false,
  toggleModal: () => set(({ isOpen }) => ({ isOpen: !isOpen })),
}));