import { client } from "api";
import { CourseProviderApiRoutes, FormDataHeader } from "api/constants";
import type {
  ApiUnitsListResponse,
  ApiUnitTypeResponse,
  ApiUnitsListParams,
  ApiQuizTypeResponse,
} from "./types";
import type { UnitSchema } from "components/shared/courseProvider/units/validation/unit.schema";
import type { QuizSchema } from "components/shared/courseProvider/editor/components/modals/quiz/validation/quiz.schema";

export const getUnits = async (moduleId: number, params?: ApiUnitsListParams): Promise<ApiUnitsListResponse> => {
  const response = await client.get(CourseProviderApiRoutes.moduleUnits(moduleId), { params });

  return response.data;
};

export const createUnit = async ({ moduleId, unit }: {moduleId: number, unit: UnitSchema}): Promise<ApiUnitTypeResponse> => {
  const response = await client.post(CourseProviderApiRoutes.moduleUnits(moduleId), unit);

  return response.data;
};

export const getUnit = async (unitId: number): Promise<ApiUnitTypeResponse> => {
  const response = await client.get(`${CourseProviderApiRoutes.units}/${unitId}`);

  return response.data;
};

export const editUnit = async ({ unitId, unit }: { unitId: number, unit: UnitSchema }): Promise<ApiUnitTypeResponse> => {
  const response = await client.put(`${CourseProviderApiRoutes.units}/${unitId}`, unit);

  return response.data;
};

export const deleteUnit = async (unitId: number): Promise<number> => {
  await client.delete(`${CourseProviderApiRoutes.units}/${unitId}`);

  return unitId;
};

export const addUnitImage = async ({ unitId, image }: { unitId: number; image: FormData; }): Promise<ApiUnitTypeResponse> => {
  const headers = FormDataHeader;
  const response  = await client.post(`${CourseProviderApiRoutes.units}/${unitId}/image`, image, { headers });

  return response.data;
};

export const getUnitQuiz = async (unitId: number): Promise<ApiQuizTypeResponse> => {
  const response = await client.get(CourseProviderApiRoutes.quiz(unitId));

  return response.data;
};

export const updateUnitQuiz = async ({ unitId, data }: { unitId: number; data: QuizSchema; }): Promise<ApiQuizTypeResponse> => {
  const response = await client.put(CourseProviderApiRoutes.quiz(unitId), data);

  return response.data;
};

export const deleteUnitQuiz = async (unitId: number): Promise<void> => {
  const response = await client.delete(CourseProviderApiRoutes.quiz(unitId));

  return response.data;
};