import type { AxiosError } from "axios";
import type { CourseSchema } from "components/shared/schoolCourseProvider/courses/validation/course.schema";
import type { Nullable } from "types/general";
import type { CourseSchoolType } from "types/models/School";

export type ApiCourseType = {
  id: number;
  provider_id: number;
  type: number;
  name: string;
  description: string;
  price: string;
  status: number;
  position: number;
  instructor: string;
  duration: number;
  about?: string;
  achievements?: string;
  created_at: string;
  updated_at: string;
  school_id: Nullable<number>;
  schools: CourseSchoolType[];
  image: string;
};

export type ApiCourseTypeResponse = {
  data: ApiCourseType;
};

export type ApiCreateCourseErrorResponse = AxiosError<{
  message: string;
  errors: Record<keyof CourseSchema, string[]>;
}>;
