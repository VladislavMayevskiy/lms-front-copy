import type { AxiosError } from "axios";
import type { ApiListResponse } from "api/types";
import type { SectionFileType } from "types/models/Section";
import type { SectionSchema } from "components/shared/courseProvider/editor/validation/section.schema";

export type ApiSectionType = {
  id: number;
  unit_id: number;
  type: number;
  title: string;
  content: string;
  position: number;
  files: SectionFileType[];
};

export type ApiSectionTypeResponse = {
  data: ApiSectionType;
};

export type ApiSectionListResponse = ApiListResponse<ApiSectionType>;

export type ApiCreateSectionErrorResponse = AxiosError<{
  message: string;
  errors: Record<keyof SectionSchema, string[]>;
}>;
