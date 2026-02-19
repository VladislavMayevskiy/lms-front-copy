import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { updateProfile } from "./index";
import type { ProfileSchema } from "components/shared/courseProvider/settings/validation/profile.schema";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<void, AxiosError<{ message: string; }>, ProfileSchema>({
    mutationKey: ['update-course-provider-profile'],
    mutationFn: updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-user'] });
    },
  });
};