import { client } from "api";
import type { ApiUsersList , ApiUserResponse, GetUsersParams, UserActivityType} from "./types";
import { AdminApiRoutes } from "api/constants";
import type { CreateUserSchema, UpdateUserSchema } from "components/shared/admin/users/components/validation";

export const getUsers = async(params?: GetUsersParams): Promise<ApiUsersList> => {
    const response = await client.get(AdminApiRoutes.users, {
        params: {
            ...(params?.search && { "filter[search]": params.search }),
            ...(params?.sort && { sort: params.sort }),
            ...(params?.filter && { filter: params.filter }),
        },
    })
    
    return response.data
}

export const getUserById = async(id: number): Promise<ApiUserResponse> => {
  const response = await client.get(`${AdminApiRoutes.users}/${id}`);
  return response.data;
}

export const updateUsers = async ({ id, data,}: {id: number;data: UpdateUserSchema;}) => {
  const payload = {
    ...data,
    role: Number(data.role),
    gender: Number(data.gender),
  };

  const response = await client.put(`${AdminApiRoutes.users}/${id}`, payload);

  return response.data;
};



export const createUsers = async (data: CreateUserSchema): Promise<ApiUsersList> => {
  const payload = {
    ...data,
    role: Number(data.role),
    gender: Number(data.gender),
    password_confirmation: data.password
  };

  const response = await client.post(AdminApiRoutes.users, payload);
  return response.data;
};

export const deleteUsers = async(id: number): Promise<ApiUsersList> => {
  const response = await client.delete(`${AdminApiRoutes.users}/${id}`)
  return response.data
}

export const getUserActivity = async (userId: number): Promise<UserActivityType> => {
  const response = await client.get(AdminApiRoutes.activity(userId));
  return response.data.data;
}

export const getUserAssignedCourses = async (userId: number) => {
  const response = await client.get(AdminApiRoutes.assignedCourses(userId));
  return response.data;
}