import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCourseTranslations,
  updateCourseTranslation,
  getModuleTranslations,
  updateModuleTranslation,
  getSectionTranslations,
  updateSectionTranslation,
  getUnitTranslations,
  updateUnitTranslation,
} from "./index";
import type { ApiTranslationsResponse, ApiTranslationUpdatePayload } from "./types";

// ── Course ────────────────────────────────────────────────────────────────────

export const useCourseTranslations = (courseId: number) =>
  useQuery<ApiTranslationsResponse>({
    queryKey: ["course-translations", courseId],
    queryFn: () => getCourseTranslations(courseId),
    enabled: Boolean(courseId),
  });

export const useUpdateCourseTranslation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTranslationsResponse,
    Error,
    { courseId: number; language: string; payload: ApiTranslationUpdatePayload }
  >({
    mutationFn: ({ courseId, language, payload }) =>
      updateCourseTranslation(courseId, language, payload),
    onSuccess: (_data, { courseId }) => {
      queryClient.invalidateQueries({ queryKey: ["course-translations", courseId] });
    },
  });
};

// ── Module ────────────────────────────────────────────────────────────────────

export const useModuleTranslations = (moduleId: number) =>
  useQuery<ApiTranslationsResponse>({
    queryKey: ["module-translations", moduleId],
    queryFn: () => getModuleTranslations(moduleId),
    enabled: Boolean(moduleId),
  });

export const useUpdateModuleTranslation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTranslationsResponse,
    Error,
    { moduleId: number; language: string; payload: ApiTranslationUpdatePayload }
  >({
    mutationFn: ({ moduleId, language, payload }) =>
      updateModuleTranslation(moduleId, language, payload),
    onSuccess: (_data, { moduleId }) => {
      queryClient.invalidateQueries({ queryKey: ["module-translations", moduleId] });
    },
  });
};

// ── Section ───────────────────────────────────────────────────────────────────

export const useSectionTranslations = (sectionId: number) =>
  useQuery<ApiTranslationsResponse>({
    queryKey: ["section-translations", sectionId],
    queryFn: () => getSectionTranslations(sectionId),
    enabled: Boolean(sectionId),
  });

export const useUpdateSectionTranslation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTranslationsResponse,
    Error,
    { sectionId: number; language: string; payload: ApiTranslationUpdatePayload }
  >({
    mutationFn: ({ sectionId, language, payload }) =>
      updateSectionTranslation(sectionId, language, payload),
    onSuccess: (_data, { sectionId }) => {
      queryClient.invalidateQueries({ queryKey: ["section-translations", sectionId] });
    },
  });
};

// ── Unit ──────────────────────────────────────────────────────────────────────

export const useUnitTranslations = (unitId: number) =>
  useQuery<ApiTranslationsResponse>({
    queryKey: ["unit-translations", unitId],
    queryFn: () => getUnitTranslations(unitId),
    enabled: Boolean(unitId),
  });

export const useUpdateUnitTranslation = () => {
  const queryClient = useQueryClient();
  return useMutation<
    ApiTranslationsResponse,
    Error,
    { unitId: number; language: string; payload: ApiTranslationUpdatePayload }
  >({
    mutationFn: ({ unitId, language, payload }) =>
      updateUnitTranslation(unitId, language, payload),
    onSuccess: (_data, { unitId }) => {
      queryClient.invalidateQueries({ queryKey: ["unit-translations", unitId] });
    },
  });
};
