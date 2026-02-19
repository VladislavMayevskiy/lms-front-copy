import { getUsers, updateUsers, createUsers, deleteUsers, getUserById, getUserActivity, getUserAssignedCourses} from "./index";
import type { GetUsersParams, UserActivityType, ApiUsersList  } from "./types";
import { useMutation, useQuery , useQueryClient} from "@tanstack/react-query";

export const useGetUsers = (params?: GetUsersParams) => {
    const response = useQuery<ApiUsersList>({
      queryKey:["users-list", params?.sort, params?.search],
      queryFn: () => getUsers(params),
      placeholderData: (prev) => prev
    })

    return {
        ...response,
        users: response.data?.data ?? []
    }
}

export const useGetUserById = (id: number) => {
  return useQuery({
    queryKey: ["user-by-id", id],
    queryFn: () => getUserById(id),
  });
}

export const useUpdateUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["users-update"],
    mutationFn: updateUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
};

export const useCreateUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["users-create"],
    mutationFn: createUsers,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
    },
  });
};

export const useDeleteUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
  mutationKey: ["users-delete"],
  mutationFn: deleteUsers,
  onSuccess: () => {
    queryClient.invalidateQueries({queryKey: ["users-list"]})
  }
  })
}

export const useGetUsersActivity = (userId: number) => {
  return useQuery<UserActivityType>({
    queryKey: ["user-activity", userId],
    queryFn: () => getUserActivity(userId),
    enabled: Number.isFinite(userId),
  });
};

export const useGetUserAssignedCourses = (userId: number) => {
  const response = useQuery<ApiUsersList>({
    queryKey: ["user-assigned-courses", userId],
    queryFn: () => getUserAssignedCourses(userId),
  });
  return {
    ...response,
    data: response.data?.data ?? []
  }
} 