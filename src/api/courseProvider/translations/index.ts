import { client } from "api";
import { CourseProviderApiRoutes } from "api/constants";
import type { ApiTranslationsResponse, ApiTranslationUpdatePayload } from "./types";

// ── Course ────────────────────────────────────────────────────────────────────

export const getCourseTranslations = async (courseId: number): Promise<ApiTranslationsResponse> => {
  const response = await client.get(CourseProviderApiRoutes.courseTranslations(courseId));
  return response.data;
};

export const updateCourseTranslation = async (
  courseId: number,
  language: string,
  payload: ApiTranslationUpdatePayload,
): Promise<ApiTranslationsResponse> => {
  const response = await client.put(
    CourseProviderApiRoutes.courseTranslation(courseId, language),
    payload,
  );
  return response.data;
};

// ── Module ────────────────────────────────────────────────────────────────────

export const getModuleTranslations = async (moduleId: number): Promise<ApiTranslationsResponse> => {
  const response = await client.get(CourseProviderApiRoutes.moduleTranslations(moduleId));
  return response.data;
};

export const updateModuleTranslation = async (
  moduleId: number,
  language: string,
  payload: ApiTranslationUpdatePayload,
): Promise<ApiTranslationsResponse> => {
  const response = await client.put(
    CourseProviderApiRoutes.moduleTranslation(moduleId, language),
    payload,
  );
  return response.data;
};

// ── Section ───────────────────────────────────────────────────────────────────

export const getSectionTranslations = async (sectionId: number): Promise<ApiTranslationsResponse> => {
  const response = await client.get(CourseProviderApiRoutes.sectionTranslations(sectionId));
  return response.data;
};

export const updateSectionTranslation = async (
  sectionId: number,
  language: string,
  payload: ApiTranslationUpdatePayload,
): Promise<ApiTranslationsResponse> => {
  const response = await client.put(
    CourseProviderApiRoutes.sectionTranslation(sectionId, language),
    payload,
  );
  return response.data;
};

// ── Unit ──────────────────────────────────────────────────────────────────────

export const getUnitTranslations = async (unitId: number): Promise<ApiTranslationsResponse> => {
  const response = await client.get(CourseProviderApiRoutes.unitTranslations(unitId));
  return response.data;
};

export const updateUnitTranslation = async (
  unitId: number,
  language: string,
  payload: ApiTranslationUpdatePayload,
): Promise<ApiTranslationsResponse> => {
  const response = await client.put(
    CourseProviderApiRoutes.unitTranslation(unitId, language),
    payload,
  );
  return response.data;
};
