import { useMutation } from "@tanstack/react-query";
import {
  login,
  createAccount,
  forgotPassword,
} from "./index";
import type { AuthResponse, AuthApiError } from "./types";
import type { LoginSchema } from "modules/auth/login/validation/login.schema";
import type { CreateAccountSchema } from "modules/auth/create-account/validation/createAccount.schema";
import type { ForgotPasswordSchema } from "modules/auth/forgot-password/validation/forgotPassword.schema";

export const useLogin = () => {
  return useMutation<AuthResponse, AuthApiError<LoginSchema>, LoginSchema>({
    mutationKey: ["login"],
    mutationFn: login,
  });
};

export const useCreateAccount = () => {
  return useMutation<AuthResponse, AuthApiError<CreateAccountSchema>, CreateAccountSchema>({
    mutationKey: ["create-account"],
    mutationFn: createAccount,
  });
};

export const useForgotPassword = () => {
  return useMutation<void, AuthApiError<ForgotPasswordSchema>, ForgotPasswordSchema>({
    mutationKey: ["forgot-password"],
    mutationFn: forgotPassword,
  });
};
