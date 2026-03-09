import { GetCourses, ShowCourse, StartCourse, CompleteUnit, GetQuiz, SubmitQuiz, PurchaseCourse, GetUserCourses, GetQuizResult } from "./index";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { ApiCourseType, UseGetCoursesParams, FinalQuizSubmitPayload, PurchaseCourseType, UserCourseType } from "./types";
import { queryClient } from "api";


export const useGetCourses = (params?: UseGetCoursesParams) => {
  return useQuery<ApiCourseType[]>({
    queryKey: ["courses", params],
    queryFn: () => GetCourses({ page: 1, size: 9, ...params }),
  });
};

export const useGetUserCourses = (params?: { progress_status?: number }) => {
  return useQuery<UserCourseType[]>({
    queryKey: ["user-courses", params],
    queryFn: () => GetUserCourses(params),
  });
};


export const useShowCourse = (courseId: number) => {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => ShowCourse(courseId),
    enabled: !!courseId,

  })
}
export const useStartCourse = () => {
  return useMutation({
    mutationKey: ["start-course"],
    mutationFn: (courseId: number) => StartCourse(courseId),
    onSuccess: (_, courseId) => {
      queryClient.invalidateQueries({
        queryKey: ["show-course", courseId],
      });
    },
  });
};


export const useCompleteUnit = (courseId: number) => {
  return useMutation({
    mutationFn: (unitId: number) => CompleteUnit(unitId),

    onSuccess: async (_, unitId) => {
      await queryClient.invalidateQueries({ queryKey: ["course", courseId] });

      await queryClient.refetchQueries({ queryKey: ["course", courseId] });

      queryClient.setQueryData(["course", courseId], (old: any) => {
        if (!old) return old;

        for (const m of old.modules) {
          for (const u of m.units) {
            if (u.id === unitId) u.is_completed = true;
          }
        }
        return { ...old };
      });
    },
  });
};


export const useGetQuiz = (unitId: number) => {
  return useQuery({
    queryKey: ["quiz", unitId],
    queryFn: () => GetQuiz(unitId),
    retry: false,
    enabled: unitId > 0,
    // Always re-fetch when the component mounts (e.g. student returns to the unit
    // after navigating away).  Avoids serving stale cached quiz data.
    refetchOnMount: "always",
    // Window-focus refetch is not needed here and could interfere with the quiz
    // submission flow if the user alt-tabs mid-quiz.
    refetchOnWindowFocus: false,
  });
};

export const useGetQuizResult = (unitId: number) => {
  return useQuery({
    queryKey: ["quiz-result", unitId],
    queryFn: () => GetQuizResult(unitId),
    retry: false,
    enabled: unitId > 0,
    // Always re-fetch on mount so revisiting a unit reflects the latest result.
    refetchOnMount: "always",
    refetchOnWindowFocus: false,
  });
};




export const useSubmitQuiz = (unitId: number) =>
  useMutation({
    mutationFn: (payload: FinalQuizSubmitPayload) => SubmitQuiz(unitId, payload),
    onSuccess: () => {
      // Invalidate the cached result so revisiting the unit shows the new result.
      queryClient.invalidateQueries({ queryKey: ["quiz-result", unitId] });
    },
  });

export const usePurchaseCourse = (courseId: number) => {
  return useMutation({
    mutationKey: ["purchase-course", courseId],
    mutationFn: (payload: PurchaseCourseType) => PurchaseCourse(courseId, payload),
  });
};