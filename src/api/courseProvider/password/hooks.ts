import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { changePassword } from "./index";
import type { PasswordSchema } from "components/shared/courseProvider/settings/validation/password.schema";

export const useChangePassword = () => {
  return useMutation<void, AxiosError<{ message: string; }>, PasswordSchema>({
    mutationKey: ['change-course-provider-password'],
    mutationFn: changePassword,
  });
};