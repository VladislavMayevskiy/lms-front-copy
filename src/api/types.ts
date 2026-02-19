import type { AxiosError } from "axios";
import type { Nullable } from "types/general";

export type ApiPaginatioMetaType = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type ApiError<T> = AxiosError<T>;

export type ApiValidationErrorResponse = ApiError<{
  message: string;
  errors: {
    [key: string]: string[];
  };
}>;

export type ApiListLinks = {
  first: string;
  last: string;
  prev: Nullable<string>;
  next: Nullable<string>;
};

export type ApiListMeta = {
  current_page: number;
  from: number;
  last_page: number;
  per_page: number;
  to: number;
  total: number;
};

export type ApiListResponse<T> = {
  data: T[];
  links: ApiListLinks;
  meta: ApiListMeta;
};

export type ApiDataResponse<T> = {
  data: T;
};
