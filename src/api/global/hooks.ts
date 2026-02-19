import { useMutation, useQuery,useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, updateCurrentUser, getSchools } from "./index";
import { mapFromUser } from "./utils";

export const useCurrentUserQuery = (enabled: boolean = true) => {

  const response = useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    enabled,
  });
  const user = response.data?.data ? mapFromUser(response.data.data) : null;

  return {
    ...response,
    data: user,
  };
};

export const useUpdateCurrentUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["user-update"],
    mutationFn: updateCurrentUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-user"] });
    },
  });
};

export const useSchools = () => {
  return useQuery({
    queryKey: ["schools"],
    queryFn: getSchools,
  });
};
