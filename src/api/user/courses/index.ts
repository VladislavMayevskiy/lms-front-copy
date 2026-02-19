import { client } from "api";
import type { ApiCourseType, ApiCourseShow, ApiCourseStart, FinalQuizSubmitPayload, PurchaseCourseType, UserCourseType, QuizQuestion } from "./types";

import { UserApiRoutes } from "api/constants";

type GetCoursesParams = {
  category?: "featured" | "recommended" | "most_popular" | "beginner";
  page?: number;
  size?: number;
};

export const GetCourses = async (
  params?: GetCoursesParams
): Promise<ApiCourseType[]> => {
  const response = await client.get(UserApiRoutes.courses, {
    params: {
      ...(params?.category && {
        "filter[category]": params.category,
      }),
      ...(params?.page && {
        "page[number]": params.page,
      }),
      ...(params?.size && {
        "page[size]": params.size,
      }),
    },
  });

  return response.data.data;
};

export const GetUserCourses = async (
  params?: { progress_status?: number }
): Promise<UserCourseType[]> => {
  const response = await client.get(UserApiRoutes.myCourses, {
    params: {
      ...(params?.progress_status && {
        "filter[progress_status]": params.progress_status,
      }),
    },
  });

  return response.data.data;
};


export const ShowCourse = async (courseId: number): Promise<ApiCourseShow> => {
  const response = await client.get(UserApiRoutes.showCourse(courseId))
  return response.data.data
}

export const StartCourse = async (courseId: number):Promise<ApiCourseStart> => {
  const response = await client.post(UserApiRoutes.startCourse(courseId))
  return response.data
}

export const CompleteUnit = async (unitId: number) => {
  const response = await client.post(UserApiRoutes.finishUnit(unitId))
  return response.data
}

export const GetQuiz = async (unitId: number): Promise<QuizQuestion[]> => {
  const response = await client.get(UserApiRoutes.quiz(unitId))
  return response.data
}

export const SubmitQuiz = async (courseId: number, payload: FinalQuizSubmitPayload) => {
  const response = await client.post(UserApiRoutes.finishUnit(courseId), payload);
  return response.data;
};

export const PurchaseCourse = async (courseId: number, payload: PurchaseCourseType) => {
  const response = await client.post(UserApiRoutes.purchaseCourse(courseId), payload)
  return response.data
}

export const GetQuizResult = async (unitId: number) => {
  const response = await client.get(UserApiRoutes.quiz_result(unitId))
  return response.data
}