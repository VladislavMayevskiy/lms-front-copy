import { client } from "api";
import type { ChangePasswordType, ActivityResponse} from "./types";
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

export const GetStudents = async (sort?: string, search?: string) => {
  const response = await client.get(UserApiRoutes.students, {
    params: {
      ...(sort && { sort }),
      ...(search && { "filter[search]": search }),
    },
  })
  return response.data
}

export const GetStudentCourse = async ( userId: number, sort?: string, search?: string ) => {
  const response = await client.get(UserApiRoutes.studentCourse(userId), {
    params: {
      ...(sort && { sort }),
      ...(search && { "filter[search]": search }),
    },
  })
  return response.data
}

export const GetStudentQuiz = async ( userId: number, courseId: number ) => {
  const response = await client.get(UserApiRoutes.studentQuiz(userId,courseId))
  return response.data
}