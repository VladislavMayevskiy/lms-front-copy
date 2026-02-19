import type { ApiError } from "api/types";

export type AuthResponse = {
  data: {
    token: string;
  };
};

export type AuthApiError<T> = ApiError<{
  message: string;
  errors: {
    [key in keyof T]: string[];
  };
}>;
