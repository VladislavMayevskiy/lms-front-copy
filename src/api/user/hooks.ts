import {
  UpdatePasswordUser,
  UpdateImageUser,
  DeleteUser,
  DeleteImageUser,
  getActivity,
  GetQuizAnalyticsCourse,
  GetQuizAnalyticsUnit,
  GetTeacherStudents,
  GetTeacherStudentCourses,
  GetTeacherStudentCourseQuizResults,
} from "./index";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "api";
import type {
  QuizAnalyticsCourseResponse,
  QuizAnalyticsUnitResponse,
  TeacherStudentsResponse,
  TeacherStudentCoursesResponse,
  TeacherStudentCourseQuizResultsResponse,
} from "./types";
import type { CurrentUserResponse } from "api/global/types";


export const useUpdatePasswordUser = () => {
    return useMutation({
        mutationKey: ['update-password'],
        mutationFn: UpdatePasswordUser
    })
}

/** Append (or replace) a `_v=<timestamp>` param to `url` so the browser
 *  is forced to reload the image even if the base URL hasn't changed. */
const addCacheBust = (url: string | null | undefined): string | null => {
  if (!url) return null;
  if (url.includes('_v=')) {
    return url.replace(/_v=\d+/, `_v=${Date.now()}`);
  }
  return url.includes('?') ? `${url}&_v=${Date.now()}` : `${url}?_v=${Date.now()}`;
};

export const useUpdateImageUser = () => {
  return useMutation({
    mutationKey: ['update-user-image'],
    mutationFn: (file: File) => UpdateImageUser(file),
    onSuccess: (res) => {
      // Use an updater function so we merge into the existing cache entry rather
      // than blindly replacing it. Also append a cache-bust param so every
      // subscriber (sidebar, drawer, profile page, …) forces a fresh browser
      // fetch of the new image, even when the base URL hasn't changed.
      queryClient.setQueryData(
        ['current-user'],
        (old: CurrentUserResponse | undefined): CurrentUserResponse | undefined => {
          if (!old?.data) return old;
          // Handle both response shapes: { data: ApiUserType } or ApiUserType directly
          const patch = res?.data ?? null;
          const merged = patch ? { ...old.data, ...patch } : old.data;
          return { data: { ...merged, image: addCacheBust(merged.image) } };
        },
      );
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });
};

export const useDeleteImageUser = () => {
  return useMutation({
    mutationFn: DeleteImageUser,
    onSuccess: () => {
      // Immediately clear the image in the cache so the avatar disappears
      // without waiting for the background refetch to complete.
      queryClient.setQueryData(
        ['current-user'],
        (old: CurrentUserResponse | undefined): CurrentUserResponse | undefined => {
          if (!old?.data) return old;
          return { data: { ...old.data, image: null } };
        },
      );
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });
}

export const useDeleteUser = () => {
  return useMutation({
    mutationKey: ['delete-user-account'],
    mutationFn: DeleteUser,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["current-user"] }); },
  })
}

export const useGetActivity = () => {
  return useQuery({
    queryKey: ["activity"],
    queryFn: getActivity,
  });
};

const TEACHER_STALE_TIME = 5 * 60 * 1000;

export const useGetQuizAnalyticsCourse = (courseId?: number) => {
  return useQuery<QuizAnalyticsCourseResponse>({
    queryKey: ["quiz-analytics-course", courseId],
    queryFn: () => GetQuizAnalyticsCourse(courseId as number),
    enabled: !!courseId && courseId > 0,
    staleTime: TEACHER_STALE_TIME,
    retry: false,
  });
};

export const useGetQuizAnalyticsUnit = (unitId?: number) => {
  return useQuery<QuizAnalyticsUnitResponse>({
    queryKey: ["quiz-analytics-unit", unitId],
    queryFn: () => GetQuizAnalyticsUnit(unitId as number),
    enabled: !!unitId && unitId > 0,
    staleTime: TEACHER_STALE_TIME,
    retry: false,
  });
};

export const useTeacherStudents = () => {
  return useQuery<TeacherStudentsResponse>({
    queryKey: ["teacher-students"],
    queryFn: GetTeacherStudents,
    staleTime: TEACHER_STALE_TIME,
    retry: false,
    placeholderData: (prev) => prev,
  });
};

export const useTeacherStudentCourses = (userId?: number) => {
  return useQuery<TeacherStudentCoursesResponse>({
    queryKey: ["teacher-student-courses", userId],
    queryFn: () => GetTeacherStudentCourses(userId as number),
    enabled: !!userId && userId > 0,
    staleTime: TEACHER_STALE_TIME,
    retry: false,
    placeholderData: (prev) => prev,
  });
};

export const useTeacherStudentCourseQuizResults = (userId?: number, courseId?: number) => {
  return useQuery<TeacherStudentCourseQuizResultsResponse>({
    queryKey: ["teacher-student-quiz-results", userId, courseId],
    queryFn: () => GetTeacherStudentCourseQuizResults(userId as number, courseId as number),
    enabled: !!userId && userId > 0 && !!courseId && courseId > 0,
    staleTime: TEACHER_STALE_TIME,
    retry: false,
  });
};
