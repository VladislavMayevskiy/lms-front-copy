import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createCourse,
  editCourse,
} from "./index";
import type {
  ApiCourseTypeResponse,
  ApiCreateCourseErrorResponse,
} from "./types";

export const useCreateCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiCourseTypeResponse, ApiCreateCourseErrorResponse, FormData>({
    mutationKey: ['create-course'],
    mutationFn: createCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-provider-courses'] });
    },
  });
};

export const useEditCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiCourseTypeResponse, ApiCreateCourseErrorResponse, {courseId: number, course: FormData}>({
    mutationKey: ['edit-course'],
    mutationFn: editCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-provider-courses'] });
    },
  });
};
