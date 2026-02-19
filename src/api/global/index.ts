import { client } from "api";
import { UserApiRoutes } from "api/constants";
import type {
  ApiUpdateUserType,
  CurrentUserResponse,
  ApiSchoolsResponse,
} from "./types";

export const getCurrentUser = async (): Promise<CurrentUserResponse> => {
  const response = await client.get(UserApiRoutes.profile);

  return response.data;
};

export const updateCurrentUser = async (data: ApiUpdateUserType): Promise<CurrentUserResponse> => {
  const response = await client.put(UserApiRoutes.profile, data);

  return response.data;
};

export const getSchools = async (): Promise<ApiSchoolsResponse> => {
  const response = await client.get(UserApiRoutes.schools);

  return response.data;
};
