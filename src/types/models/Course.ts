import type { Nullable } from "../general";
import type { CourseSchoolType } from "./School";

export type CourseTypes = "Audio" | "Video" | "Mixed";
export type CourseStatusType = "Draft" | "Published" | "Archived";

export type CourseListType = {
  id: number;
  providerId: number;
  type: CourseTypes;
  name: string;
  description: string;
  status: CourseStatusType;
  position: number;
  instructor: string;
  duration: number;
  about?: string;
  achievements?: string;
  createdAt: string;
  updatedAt: string;
  schoolId: Nullable<number>;
  schoolsCount: Nullable<number>;
  image: string;
};

export type CourseType = {
  id: number;
  providerId: number;
  type: CourseTypes;
  name: string;
  description: string;
  status: CourseStatusType;
  position: number;
  instructor: string;
  duration: number;
  about?: string;
  achievements?: string;
  createdAt: string;
  updatedAt: string;
  schoolId: Nullable<number>;
  schools: CourseSchoolType[];
  image: string;
};

export type CourseProgressStatusType =
  | 'NotStarted'
  | 'Started'
  | 'Completed'