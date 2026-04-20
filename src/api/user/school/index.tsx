import type { ApiSchoolType, ApiSchoolsList } from "./types";
import { client } from "api";
import { UserApiRoutes } from "api/constants";

export const getSchools = async (): Promise<ApiSchoolsList> => {
    const response = await client.get(UserApiRoutes.schools);
    return response.data;
};

export const getSchool = async (id: number): Promise<ApiSchoolType> => {
  const response = await client.get(`${UserApiRoutes.schools}/${id}`);
  const body = response.data as { data?: ApiSchoolType } | ApiSchoolType;
  if (body && typeof body === "object" && "data" in body && body.data) {
    return body.data;
  }
  return body as ApiSchoolType;
};