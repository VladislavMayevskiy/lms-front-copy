import { useMutation, useQuery,useQueryClient } from "@tanstack/react-query";
import { getCurrentUser, updateCurrentUser, getSchools } from "./index";
import { mapFromUser } from "./utils";

const CURRENT_USER_STALE_MS = 1000 * 60 * 5; // avoid refetch-on-mount churn during navigation

export const useCurrentUserQuery = (enabled: boolean = true) => {

  const response = useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    enabled,
    staleTime: CURRENT_USER_STALE_MS,
    placeholderData: (previousData) => previousData,
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
