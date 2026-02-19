import { UpdatePasswordUser, UpdateImageUser, DeleteUser, DeleteImageUser, getActivity, GetStudents, GetStudentCourse, GetStudentQuiz } from "./index";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "api";


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
    onSuccess: (res) => {queryClient.setQueryData(["current-user"], res.data)}
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

export const useGetStudents = (sort?: string, search?: string) => {
  return useQuery({
    queryKey: ["students", sort, search],
    queryFn: () => GetStudents(sort, search),
    placeholderData: (prev) => prev
  })
}

export const useGetStudentCourse = (userId?: number, sort?: string, search?: string) => {
  return useQuery({
    queryKey: ["students-course", userId, sort, search],
    queryFn: () => GetStudentCourse(userId as number, sort, search),
    enabled: Number.isFinite(userId),
    placeholderData: (prev) => prev
  });
};

export const useGetStudentQuiz = (userId?: number, courseId?: number) => {
  return useQuery({
    queryKey: ["students-course", userId, courseId],
    queryFn: () => GetStudentQuiz(userId as number, courseId as number),
    enabled: Number.isFinite(userId),
  });
};

