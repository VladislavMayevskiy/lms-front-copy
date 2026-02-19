import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getModules,
  createModule,
  getModule,
  editModule,
  deleteModule,
} from "./index";
import { mapFromModules, mapFromModule } from "./utils";
import type {
  ApiModuleType,
  ApiModuleTypeResponse,
  ApiCreateModuleErrorResponse,
  ApiModulesListParams,
} from "./types";
import type { ModuleSchema } from "components/shared/courseProvider/modules/validation/module.schema";

export const useModulesQuery = (courseId: number, params?: ApiModulesListParams) => {
  const response = useQuery({
    queryKey: ['course-provider-modules', courseId, params],
    queryFn: () => getModules(courseId, params),
  });
  const modules = mapFromModules(response.data?.data || []);

  return {
    ...response,
    data: {
      ...response.data,
      data: modules,
    },
  };
};

export const useCreateModule = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiModuleTypeResponse, ApiCreateModuleErrorResponse, { courseId: number, module: ModuleSchema }>({
    mutationKey: ['create-module'],
    mutationFn: createModule,
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['course-provider-modules', data.course_id] });
    },
  });
};

export const useModuleQuery = (moduleId: number) => {
  const response = useQuery({
    queryKey: ['course-provider-module', moduleId],
    queryFn: () => getModule(moduleId),
  });
  const module = mapFromModule(response.data?.data || {} as ApiModuleType);

  return {
    ...response,
    data: module,
  };
};

export const useEditModule = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiModuleTypeResponse, ApiCreateModuleErrorResponse, {moduleId: number, module: ModuleSchema}>({
    mutationKey: ['edit-module'],
    mutationFn: editModule,
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['course-provider-modules', data.course_id] });
    },
  });
};

export const useDeleteModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-module'],
    mutationFn: deleteModule,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-provider-modules'] });
    },
  });
};
