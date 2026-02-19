import { create } from "zustand";

export type CourseProviderModalName = "CreateCourse" | "CreateModule" | "CreateUnit" | "Delete" | "AssignedSchools";

export const CourseProviderModalConsts: Record<CourseProviderModalName, CourseProviderModalName> = {
  CreateCourse: "CreateCourse",
  CreateModule: "CreateModule",
  CreateUnit: "CreateUnit",
  Delete: "Delete",
  AssignedSchools: "AssignedSchools",
};

type ModalState = {
  isOpen: boolean;
};

type ModalStore = {
  modals: Record<CourseProviderModalName, ModalState>;
  openModal: (modalName: CourseProviderModalName) => void;
  closeModal: (modalName: CourseProviderModalName) => void;
  closeAllModals: () => void;
};

export const useModal = create<ModalStore>((set) => ({
  modals: Object.values(CourseProviderModalConsts).reduce((acc, modalName) => {
    acc[modalName] = { isOpen: false };
    return acc;
  }, {} as Record<CourseProviderModalName, ModalState>),
  openModal: (modalName) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: { isOpen: true }
      }
    })
  ),
  closeModal: (modalName) =>
    set((state) => ({
      modals: {
        ...state.modals,
        [modalName]: { isOpen: false }
      }
    })
  ),
  closeAllModals: () =>
    set(() => ({
      modals: Object.values(CourseProviderModalConsts).reduce((acc, modal) => {
        acc[modal] = { isOpen: false };
        return acc;
      }, {} as Record<CourseProviderModalName, ModalState>)
    })
  ),
}));
