import type { UserType } from "types/models/User";
import type { ApiUserType } from "./types";
import { RolesByNumber } from "constants/roles";

export const mapFromUser = (user: ApiUserType): UserType => {
  return {
    ...user,
    role: RolesByNumber[user.role],
    // Preserve null — coercing to 0 breaks school branding (Boolean(0) is false).
    school_id: user.school_id ?? null,
  };
};