import { create } from "zustand";
import type { CourseListType } from "types/models/Course";
import type { Nullable } from "types/general";

type CourseStore = {
  course: Nullable<CourseListType>;
  setCourse: (course: Nullable<CourseListType>) => void;
};

export const useCourseStore = create<CourseStore>((set) => ({
  course: null,
  setCourse: (course) => set({ course }),
}));