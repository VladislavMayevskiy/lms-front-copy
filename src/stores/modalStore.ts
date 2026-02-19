import { create } from "zustand";

export type ModalKind =
  | "CREATE_DISTRICT"
  | "EDIT_DISTRICT"
  | "DELETE_DISTRICT"
  | "CREATE_SCHOOL"
  | "EDIT_SCHOOL"
  | "DELETE_SCHOOL"
  | "ASSIGN_SCHOOL"
  | "CREATE_USER"
  | "EDIT_USER"
  | "DELETE_USER"
  | "UPDATE_IMAGE_USER"
  | "DESTROY_USER"
  | "DELETE_IMAGE_USER"
  | "ACTIVATE_SUBSCRIPTION"
  | "CANCEL_SUBSCRIPTION"
  | "EDIT_BILLING_DETAILS"
  | "EDIT_CARD_DETAILS"
  | "PURCHASE_COURSE"
  | "EDIT_ASSIGN_SCHOOL"
  | "DELETE_ASSIGN_SCHOOL"
  | "ACTIVATE_INVOICE_SUBSCRIPTION"
  | "NONE";

export type ModalPayload = {
  id?: number;
  districtId?: number;
  data?: any;
  currentSchoolIds?: number[];
  schoolId?: number;
  subscriptionType?: 1 | 2;
};


type ModalStore = {
  type: ModalKind;
  payload: ModalPayload | null;

  openModal: (type: ModalKind, payload?: ModalPayload) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  type: "NONE",
  payload: null,

  openModal: (type, payload) =>
    set({
      type,
      payload
    }),

  closeModal: () =>
    set({
      type: "NONE",
      payload: null,
    }),
}));
