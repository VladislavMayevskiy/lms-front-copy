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


export const useUpdatePasswordUser = () => {
    return useMutation({
        mutationKey: ['update-password'],
        mutationFn: UpdatePasswordUser
    })
}

export const useUpdateImageUser = () => {
  return useMutation({
    mutationKey: ['update-user-image'],
    mutationFn: (file: File) => UpdateImageUser(file),
    onSuccess: (res) => {
      if (res?.data) {
        queryClient.setQueryData(["current-user"], res);
      }
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
};

export const useDeleteImageUser = () => {
  return useMutation({
    mutationFn: DeleteImageUser,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["current-user"] }); },
  })
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
