import { client } from "api";
import { UserApiRoutes } from "api/constants";
import type { SettingsSchema } from "modules/user/settings/validation/settings.schema";
import type { CurrentUserResponse } from "api/global/types";

export const saveSettings = async (data: SettingsSchema): Promise<CurrentUserResponse> => {
  const response = await client.put(UserApiRoutes.settings, data);

  return response.data;
};
