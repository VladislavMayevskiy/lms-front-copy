import { client } from "api";
import { CourseProviderApiRoutes } from "api/constants";
import type { ApiCourseTypeResponse } from "./types";

export const createCourse = async (course: FormData): Promise<ApiCourseTypeResponse> => {
  const response = await client.post(CourseProviderApiRoutes.courses, course);

  return response.data;
};

export const editCourse = async ({ courseId, course }: { courseId: number, course: FormData }): Promise<ApiCourseTypeResponse> => {
  const response = await client.post(`${CourseProviderApiRoutes.courses}/${courseId}`, course);

  return response.data;
};