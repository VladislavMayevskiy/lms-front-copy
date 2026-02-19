import type { CourseStatusType, CourseTypes, CourseProgressStatusType } from "types/models/Course";

export const CourseTypesById: Record<number, CourseTypes> = {
  1: "Audio",
  2: "Video",
  3: "Mixed",
};

export const CourseStatusById: Record<number, CourseStatusType> = {
  1: "Draft",
  2: "Published",
  3: "Archived",
};

export const CourseStatusIds: Record<CourseStatusType, number> = {
  Draft: 1,
  Published: 2,
  Archived: 3,
};

export const CourseTypeIds: Record<CourseTypes, number> = {
  Audio: 1,
  Video: 2,
  Mixed: 3,
};

export const CourseProgressByNumber: Record<number, CourseProgressStatusType> = {
  1: "NotStarted",
  2: "Started",
  3: "Completed",
};

export const CourseProgressByName: Record<CourseProgressStatusType, number | null> = {
  NotStarted: 1,
  Started: 2,
  Completed: 3,
};
