import { client } from "api";
import { UserApiRoutes } from "api/constants";
import type { PasswordSchema } from "components/shared/courseProvider/settings/validation/password.schema";

export const changePassword = async (data: PasswordSchema): Promise<void> => {
  const response = await client.put(UserApiRoutes.password, data);

  return response.data;
};