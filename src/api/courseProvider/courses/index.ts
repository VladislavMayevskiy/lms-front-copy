import { client } from "api";
import { CourseProviderApiRoutes } from "api/constants";
import type {
  ApiCoursesListResponse,
  ApiCourseTypeResponse,
  ApiCoursesListParams,
} from "./types";

export const getCourses = async (params?: ApiCoursesListParams): Promise<ApiCoursesListResponse> => {
  const response = await client.get(CourseProviderApiRoutes.courses, { params });

  return response.data;
};

export const createCourse = async (course: FormData): Promise<ApiCourseTypeResponse> => {
  const response = await client.post(CourseProviderApiRoutes.courses, course);

  return response.data;
};

export const getCourse = async (courseId: number): Promise<ApiCourseTypeResponse> => {
  const response = await client.get(`${CourseProviderApiRoutes.courses}/${courseId}`);

  return response.data;
};

export const editCourse = async ({ courseId, course }: { courseId: number, course: FormData }): Promise<ApiCourseTypeResponse> => {
  const response = await client.post(`${CourseProviderApiRoutes.courses}/${courseId}`, course);

  return response.data;
};

export const deleteCourse = async (courseId: number): Promise<number> => {
  await client.delete(`${CourseProviderApiRoutes.courses}/${courseId}`);

  return courseId;
};