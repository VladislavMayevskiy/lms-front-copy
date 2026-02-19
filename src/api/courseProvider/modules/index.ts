import { client } from "api";
import { CourseProviderApiRoutes } from "api/constants";
import type {
  ApiModulesListResponse,
  ApiModuleTypeResponse,
  ApiModulesListParams,
} from "./types";
import type { ModuleSchema } from "components/shared/courseProvider/modules/validation/module.schema";

export const getModules = async (courseId: number, params?: ApiModulesListParams): Promise<ApiModulesListResponse> => {
  const response = await client.get(CourseProviderApiRoutes.courseModules(courseId), { params });

  return response.data;
};

export const createModule = async ({ courseId, module }: {courseId: number, module: ModuleSchema}): Promise<ApiModuleTypeResponse> => {
  const response = await client.post(CourseProviderApiRoutes.courseModules(courseId), module);

  return response.data;
};

export const getModule = async (moduleId: number): Promise<ApiModuleTypeResponse> => {
  const response = await client.get(`${CourseProviderApiRoutes.modules}/${moduleId}`);

  return response.data;
};

export const editModule = async ({ moduleId, module }: { moduleId: number, module: ModuleSchema }): Promise<ApiModuleTypeResponse> => {
  const response = await client.put(`${CourseProviderApiRoutes.modules}/${moduleId}`, module);

  return response.data;
};

export const deleteModule = async (moduleId: number): Promise<number> => {
  await client.delete(`${CourseProviderApiRoutes.modules}/${moduleId}`);

  return moduleId;
};