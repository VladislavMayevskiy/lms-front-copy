import { client } from "api";
import { UserApiRoutes } from "api/constants";
import type { ProfileSchema } from "components/shared/courseProvider/settings/validation/profile.schema";

export const updateProfile = async (data: ProfileSchema): Promise<void> => {
  const response = await client.put(UserApiRoutes.profile, data);

  return response.data;
};