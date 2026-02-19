import type { UserRoleType } from "types/models/User";

export const RolesByNumber: Record<number, UserRoleType> = {
  1: 'SuperAdmin',
  2: 'CourseProvider',
  3: 'Teacher',
  4: 'Student',
  5: 'SchoolAdmin',
  6: 'SchoolCourseProvider',
};

export const RolesByName: Record<UserRoleType, number> = {
  'SuperAdmin': 1,
  'CourseProvider': 2,
  'Teacher': 3,
  'Student': 4,
  'SchoolAdmin': 5,
  'SchoolCourseProvider': 6,
};
