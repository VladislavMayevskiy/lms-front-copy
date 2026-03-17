import { create } from "zustand";
import type { TranslationEntityType } from "api/courseProvider/translations/types";

type TranslationsModalStore = {
  isOpen: boolean;
  entityType: TranslationEntityType | null;
  entityId: number | null;
  entityLabel: string;

  openModal: (
    entityType: TranslationEntityType,
    entityId: number,
    entityLabel?: string,
  ) => void;
  closeModal: () => void;
};

export const useTranslationsModal = create<TranslationsModalStore>((set) => ({
  isOpen: false,
  entityType: null,
  entityId: null,
  entityLabel: "",

  openModal: (entityType, entityId, entityLabel = "") =>
    set({ isOpen: true, entityType, entityId, entityLabel }),

  closeModal: () =>
    set({ isOpen: false, entityType: null, entityId: null, entityLabel: "" }),
}));
