import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCourses,
  createCourse,
  getCourse,
  editCourse,
  deleteCourse,
} from "./index";
import { mapFromCourses, mapFromCourse } from "./utils";
import type {
  ApiCourseTypeResponse,
  ApiCreateCourseErrorResponse,
  ApiCoursesListParams,
} from "./types";

export const useCoursesQuery = (params?: ApiCoursesListParams) => {
  const response = useQuery({
    queryKey: ['course-provider-courses', params],
    queryFn: () => getCourses(params),
  });
  const courses = mapFromCourses(response.data?.data || []);

  return {
    ...response,
    data: {
      ...response.data,
      data: courses,
    },
  };
};

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

export const useCourseQuery = (courseId: number) => {
  const response = useQuery({
    queryKey: ['course-provider-course', courseId],
    queryFn: () => getCourse(courseId),
    enabled: Boolean(courseId),
  });
  const course = mapFromCourse(response.data?.data);

  return {
    ...response,
    data: course,
  };
};

export const useEditCourse = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiCourseTypeResponse, ApiCreateCourseErrorResponse, {courseId: number, course: FormData}>({
    mutationKey: ['edit-course'],
    mutationFn: editCourse,
    onSuccess: ({ data: { id } }) => {
      queryClient.invalidateQueries({ queryKey: ['course-provider-courses'] });
      queryClient.invalidateQueries({ queryKey: ['course-provider-course', id] });
    },
  });
};

export const useDeleteCourse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['delete-course'],
    mutationFn: deleteCourse,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['course-provider-courses'] });
    },
  });
};
