import { AxiosError } from "axios";
import type { ApiListResponse } from "api/types";
import type { UnitSchema } from "components/shared/courseProvider/units/validation/unit.schema";
import type { QuizSchema } from "components/shared/courseProvider/editor/components/modals/quiz/validation/quiz.schema";

export type ApiUnitType = {
  id: number;
  module_id: number;
  name: string;
  description: string;
  position: number;
  created_at: string;
  updated_at: string;
  image: string;
};

export type ApiQuizOptionType = {
  id: number;
  label: string;
  is_correct: boolean;
};

export type ApiQuizType = {
  id: number;
  content: string;
  is_multiple: boolean;
  options: ApiQuizOptionType[];
};

export type ApiUnitTypeResponse = {
  data: ApiUnitType;
};

export type ApiUnitsListResponse = ApiListResponse<ApiUnitType>;

export type ApiCreateUnitErrorResponse = AxiosError<{
  message: string;
  errors: Record<keyof UnitSchema, string[]>;
}>;

export type ApiUnitsListParams = {
  search?: string;
};

export type ApiQuizTypeResponse = {
  data: ApiQuizType[];
};

export type ApiUpdateQuizErrorResponse = AxiosError<{
  message: string;
  errors: Record<keyof QuizSchema, string[]>;
}>;
