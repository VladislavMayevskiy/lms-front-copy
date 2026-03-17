import { client } from "api";
import { AdminLanguagesApiRoutes } from "api/constants";
import type { ApiLanguagesListResponse } from "./types";

export const getLanguages = async (): Promise<ApiLanguagesListResponse> => {
  const response = await client.get(AdminLanguagesApiRoutes.languages);
  const body = response.data;

  // Normalise: some API versions return the array directly, others wrap it in { data: [] }
  if (Array.isArray(body)) {
    return { data: body };
  }
  return body as ApiLanguagesListResponse;
};
