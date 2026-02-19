import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createDistrict, updateDistrict, getDistrict, deleteDistrict, getDistrictById } from "./index";
import type { GetDistrictParams, ApiDistrictType, ApiDistrictTypeList} from "./types";

export const useCreateDistrict = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["create-district"],
    mutationFn: createDistrict,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-districts"] });
      queryClient.invalidateQueries({ queryKey: ["schools-list"] });
    },
  });
};


export const useGetDistricts = (params?: GetDistrictParams) => {
  const query = useQuery<ApiDistrictTypeList>({
    queryKey: ["get-districts", params?.sort, params?.search],
    queryFn: () => getDistrict(params),
  });

  return {
    ...query,
    districts: query.data?.data ?? [],
  };
};



export const useUpdateDistricts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["update-district"],
    mutationFn: updateDistrict,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-districts"] });
      queryClient.invalidateQueries({ queryKey: ["schools-list"] });
      queryClient.invalidateQueries({ queryKey: ["schools-by-district"]});
    },
  });
};

export const useDeleteDistricts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["delete-district"],
    mutationFn: deleteDistrict,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get-districts"] });
      queryClient.invalidateQueries({ queryKey: ["schools-list"] });
    },
  });
};

export const useGetDistrictById = (id: number) => {
  return useQuery<ApiDistrictType>({
    queryKey: ["get-district", id],
    queryFn: async () => {
      const response = await getDistrictById(id)
      return response.data;
    },
    enabled: !!id,
  });
};