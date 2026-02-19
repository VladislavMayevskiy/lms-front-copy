import type { UserType } from "types/models/User";
import type { ApiUserType } from "./types";
import { RolesByNumber } from "constants/roles";

export const mapFromUser = (user: ApiUserType): UserType => {
  return {
    ...user,
    role: RolesByNumber[user.role],
    school_id: user.school_id ?? 0,
  };
};