import { create } from "zustand";
import type { ApiCoursesListParams } from "api/courseProvider/courses/types";

type CoursesParamsStore = {
  params?: ApiCoursesListParams;
  setParams: (params?: ApiCoursesListParams) => void;
};

export const useCoursesParams = create<CoursesParamsStore>((set) => ({
  params: {
    search: '',
  },
  setParams: (params) => set({ params }),
}));
