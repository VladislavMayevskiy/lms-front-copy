import type { AxiosError } from "axios";
import type { ApiListResponse } from "api/types";
import type { ModuleSchema } from "components/shared/courseProvider/modules/validation/module.schema";

export type ApiModuleType = {
  id: number;
  course_id: number;
  name: string;
  description: string;
  position: number;
  created_at: string;
  updated_at: string;
};

export type ApiModuleTypeResponse = {
  data: ApiModuleType;
};

export type ApiModulesListResponse = ApiListResponse<ApiModuleType>;

export type ApiCreateModuleErrorResponse = AxiosError<{
  message: string;
  errors: Record<keyof ModuleSchema, string[]>;
}>;

export type ApiModulesListParams = {
  search?: string;
};
