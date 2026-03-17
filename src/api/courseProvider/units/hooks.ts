import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getUnits,
  createUnit,
  getUnit,
  editUnit,
  deleteUnit,
  addUnitImage,
  getUnitQuiz,
  updateUnitQuiz,
  deleteUnitQuiz,
  generateUnitQuiz,
} from "./index";
import { mapFromUnits, mapFromUnit } from "./utils";
import type {
  ApiUnitType,
  ApiUnitTypeResponse,
  ApiCreateUnitErrorResponse,
  ApiUnitsListParams,
  ApiQuizTypeResponse,
  ApiUpdateQuizErrorResponse,
  ApiGenerateQuizResponse,
  ApiGenerateQuizErrorResponse,
} from "./types";
import type { UnitSchema } from "components/shared/courseProvider/units/validation/unit.schema";
import type { QuizSchema } from "components/shared/courseProvider/editor/components/modals/quiz/validation/quiz.schema";

export const useUnitsQuery = (moduleId: number, params?: ApiUnitsListParams) => {
  const response = useQuery({
    queryKey: ['course-provider-units', moduleId, params],
    queryFn: () => getUnits(moduleId, params),
  });
  const units = mapFromUnits(response.data?.data || []);

  return {
    ...response,
    data: {
      ...response.data,
      data: units,
    },
  };
};

export const useCreateUnit = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiUnitTypeResponse, ApiCreateUnitErrorResponse, { moduleId: number, unit: UnitSchema }>({
    mutationKey: ['create-unit'],
    mutationFn: createUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-provider-units'] });
    },
  });
};

export const useUnitQuery = (unitId: number) => {
  const response = useQuery({
    queryKey: ['course-provider-unit', unitId],
    queryFn: () => getUnit(unitId),
  });
  const unit = mapFromUnit(response.data?.data || {} as ApiUnitType);

  return {
    ...response,
    data: unit,
  };
};

export const useEditUnit = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiUnitTypeResponse, ApiCreateUnitErrorResponse, {unitId: number, unit: UnitSchema}>({
    mutationKey: ['edit-unit'],
    mutationFn: editUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-provider-units'] });
    },
  });
};

export const useDeleteUnit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-unit'],
    mutationFn: deleteUnit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-provider-units'] });
    },
  });
};

export const useAddUnitImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['add-unit-image'],
    mutationFn: addUnitImage,
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['course-provider-unit', data.id] });
    },
  });
};

export const useUnitQuiz = (unitId: number) => {
  return useQuery({
    queryKey: ['unit-quiz', unitId],
    queryFn: () => getUnitQuiz(unitId),
  });
};

export const useUpdateUnitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiQuizTypeResponse, ApiUpdateQuizErrorResponse, { unitId: number; data: QuizSchema; }>({
    mutationKey: ['update-unit-quiz'],
    mutationFn: updateUnitQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unit-quiz'] });
    },
  });
};

export const useDeleteUnitQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-unit-quiz'],
    mutationFn: deleteUnitQuiz,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['unit-quiz'] });
    },
  });
};

export const useGenerateUnitQuiz = () => {
  return useMutation<
    ApiGenerateQuizResponse,
    ApiGenerateQuizErrorResponse,
    { unitId: number; params: { questions_count: number } }
  >({
    mutationKey: ['generate-unit-quiz'],
    mutationFn: generateUnitQuiz,
  });
};
