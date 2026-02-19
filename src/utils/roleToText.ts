import type { UserRoleType } from "types/models/User";

export const roleToText = (role: UserRoleType): string => {
  const array = role.split(/(?=[A-Z])/);

  return `${array[0]} ${array[1]}`;
};