import { client } from "api";
import type {
  ChangePasswordType,
  ActivityResponse,
  TeacherStudentsResponse,
  TeacherStudentCoursesResponse,
  TeacherStudentCourseQuizResultsResponse,
} from "./types";
import { UserApiRoutes } from "api/constants";


export const UpdatePasswordUser = async (data: ChangePasswordType) => {
    const response = await client.put(UserApiRoutes.password, data)
    return response.data
}

export const UpdateImageUser = async (file: File) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await client.post(
    UserApiRoutes.image,
    formData
  );

  return response.data;
};

export const DeleteImageUser = async () => {
  const response = await client.delete(UserApiRoutes.image)
  return response.data
}

export const DeleteUser = async (password: string) => {
  const response = await client.post(UserApiRoutes.deleteAccount, { password });
  return response.data;
};

export const getActivity = async (): Promise<ActivityResponse> => {
  const response = await client.get(UserApiRoutes.activity);
  return response.data;
};

export const GetQuizAnalyticsCourse = async (courseId: number) => {
  const response = await client.get(UserApiRoutes.quizAnalyticsCourse(courseId))
  return response.data
}

export const GetQuizAnalyticsUnit = async (unitId: number) => {
  const response = await client.get(UserApiRoutes.quizAnalyticsUnit(unitId))
  return response.data
}

export const GetTeacherStudents = async (): Promise<TeacherStudentsResponse> => {
  const response = await client.get(UserApiRoutes.teacherStudents);
  return response.data;
};

export const GetTeacherStudentCourses = async (
  userId: number,
): Promise<TeacherStudentCoursesResponse> => {
  const response = await client.get(UserApiRoutes.teacherStudentCourses(userId));
  return response.data;
};

export const GetTeacherStudentCourseQuizResults = async (
  userId: number,
  courseId: number,
): Promise<TeacherStudentCourseQuizResultsResponse> => {
  const response = await client.get(
    UserApiRoutes.teacherStudentCourseQuizResults(userId, courseId),
  );
  return response.data;
};