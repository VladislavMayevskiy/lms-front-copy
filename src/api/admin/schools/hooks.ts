import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSchools, createSchool, updateSchool, deleteSchool, getSchoolById } from "./index";
import type { ApiSchoolsList, GetSchoolsParams, ApiSchoolType } from "./types";

export const useGetSchools = (params?: GetSchoolsParams) => {
  const query = useQuery<ApiSchoolsList>({
    queryKey: ["schools-list", params?.sort, params?.search],
    queryFn: () => getSchools(params),
    placeholderData: (prev) => prev
  });

  return {
    ...query,
    schools: query.data?? [],
  };
};

export const useCreateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["schools-create"],
    mutationFn: createSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools-list"] });
      queryClient.invalidateQueries({ queryKey: ["get-district"] });
    },
  });
};

export const useUpdateSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["schools-edit"],
    mutationFn: updateSchool,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["schools-list"] });
      queryClient.invalidateQueries({ queryKey: ["get-district"] });
      if (variables?.id) {
        queryClient.invalidateQueries({ queryKey: ["school", variables.id] });
      }
    },
  });
};

export const useDeleteSchool = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["schools-delete"],
    mutationFn: deleteSchool,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["schools-list"] });
      queryClient.invalidateQueries({ queryKey: ["get-district"] });
    },
  });
};

export const useGetSchoolById = (id: number) => {
  const query = useQuery<ApiSchoolType>({
    queryKey: ["school", id],
    queryFn: () => getSchoolById(id),
    enabled: !!id,
    placeholderData: (prev) => prev,
  });

  return {
    ...query,
    school: query.data ?? null,
  };
};
