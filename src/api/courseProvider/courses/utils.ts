import moment from "moment";
import type { CourseType, CourseListType } from "types/models/Course";
import type { ApiCourseType, ApiCourseListType } from "./types";
import { CourseTypesById, CourseStatusById } from "constants/course";

export const mapFromCourse = (course?: ApiCourseType): CourseType => {
  return course ? {
    ...course,
    providerId: course.provider_id,
    type: CourseTypesById[course.type],
    status: CourseStatusById[course.status],
    createdAt: moment(course.created_at).format("DD/MM/YYYY"),
    updatedAt: moment(course.updated_at).format("DD/MM/YYYY"),
    schoolId: course.school_id,
    schools: course.schools,
  } : {} as CourseType;
};

export const mapFromCourses = (courses: ApiCourseListType[]): CourseListType[] => {
  return courses.map((course) => ({
    ...course,
    providerId: course.provider_id,
    type: CourseTypesById[course.type],
    status: CourseStatusById[course.status],
    createdAt: moment(course.created_at).format("DD/MM/YYYY"),
    updatedAt: moment(course.updated_at).format("DD/MM/YYYY"),
    schoolId: course.school_id,
    schoolsCount: course.schools_count,
  }));
};
