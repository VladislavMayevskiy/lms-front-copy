import { client } from "api";
import { AdminApiRoutes } from "api/constants";
import type { ApiDataResponse } from "api/types";
import type { ApiCourseTypeResponse } from "api/courseProvider/courses/types";
import type { ApiNewUsersStatsResponse } from "./types";

export const getTotalCourses = async (): Promise<ApiDataResponse<number>> => {
  const response = await client.get(AdminApiRoutes.dashboardTotalCourses);

  return response.data;
};

export const getActiveSubscriptions = async (): Promise<ApiDataResponse<number>> => {
  const response = await client.get(AdminApiRoutes.dashboardActiveSubscriptions);

  return response.data;
};

export const getMostPopularCourse = async (): Promise<ApiCourseTypeResponse> => {
  const response = await client.get(AdminApiRoutes.dashboardMostPopularCourse);

  return response.data;
};

export const getNewUsers = async (months: number): Promise<ApiNewUsersStatsResponse> => {
  const response = await client.get(AdminApiRoutes.dashboardNewUsers, { params: { months } });

  return response.data;
};