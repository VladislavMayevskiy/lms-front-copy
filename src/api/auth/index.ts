import { authClient } from "api";
import { AuthApiRoutes } from "api/constants"
import type { AuthResponse } from "./types";
import type { LoginSchema } from "modules/auth/login/validation/login.schema";
import type { CreateAccountSchema } from "modules/auth/create-account/validation/createAccount.schema";
import type { ForgotPasswordSchema } from "modules/auth/forgot-password/validation/forgotPassword.schema";

export const login = async (login: LoginSchema): Promise<AuthResponse> => {
  const response = await authClient.post(AuthApiRoutes.login, login);

  return response.data;
};

export const createAccount = async (data: CreateAccountSchema): Promise<AuthResponse> => {
  const response = await authClient.post(AuthApiRoutes.register, data);

  return response.data;
};

export const forgotPassword = async (data: ForgotPasswordSchema): Promise<void> => {
  const response = await authClient.post(AuthApiRoutes.forgotPassword, data);

  return response.data;
};