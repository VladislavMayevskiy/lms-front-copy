import type { Nullable } from "types/general";
import { RolesByNumber } from "constants/roles";

export type ApiUserRole = keyof typeof RolesByNumber;

export type ApiUsersType = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  gender: number;
  birthday: string;
  role: ApiUserRole;
  phone: string;
  name: string;
  school_id: Nullable<number>;
  progress: number;
};

export type ApiUsersList = {
	data: ApiUsersType[];
};

export type ApiUserResponse = {
  data: ApiUsersType;
};

export type GetUsersParams = {
  sort?: string;
  search?: string;
  filter?: { [key: string]: string };
};

export type UserActivityType = {
  completed_count: number;
  uncompleted_count: number;
  total_duration: string;
}