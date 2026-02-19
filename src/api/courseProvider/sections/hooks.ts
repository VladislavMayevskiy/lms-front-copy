import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getSections,
  createSection,
  getSection,
  editSection,
  reorderSections,
  deleteSection,
} from "./index";
import { mapFromSections, mapFromSection } from "./utils";
import type {
  ApiSectionType,
  ApiSectionTypeResponse,
  ApiCreateSectionErrorResponse,
} from "./types";

export const useSectionsQuery = (unitId: number) => {
  const response = useQuery({
    queryKey: ['course-provider-sections', unitId],
    queryFn: () => getSections(unitId),
  });
  const sections = mapFromSections(response.data?.data || []);

  return {
    ...response,
    data: {
      ...response.data,
      data: sections,
    },
  };
};

export const useCreateSection = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiSectionTypeResponse, ApiCreateSectionErrorResponse, { unitId: number, section: FormData }>({
    mutationKey: ['create-section'],
    mutationFn: createSection,
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['course-provider-sections', data.unit_id] });
    },
  });
};

export const useSectionQuery = (sectionId: number) => {
  const response = useQuery({
    queryKey: ['course-provider-section', sectionId],
    queryFn: () => getSection(sectionId),
  });
  const section = mapFromSection(response.data?.data || {} as ApiSectionType);

  return {
    ...response,
    data: section,
  };
};

export const useEditSection = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiSectionTypeResponse, ApiCreateSectionErrorResponse, { sectionId: number, section: FormData }>({
    mutationKey: ['edit-section'],
    mutationFn: editSection,
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['course-provider-sections', data.unit_id] });
    },
  });
};

export const useReorderSections = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['reorder-sections'],
    mutationFn: reorderSections,
    onSuccess: ({ unitId }) => {
      queryClient.invalidateQueries({ queryKey: ['course-provider-sections', unitId] });
    },
  });
};

export const useDeleteSection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-section'],
    mutationFn: deleteSection,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-provider-sections'] });
    },
  });
};
