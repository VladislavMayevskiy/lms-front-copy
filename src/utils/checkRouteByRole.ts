import {
  AuthRoutes,
  CourseProviderRoutes,
  UserRoutes,
  AdminRoutes,
  SchoolAdminRoutes,
  SchoolCourseProviderRoutes,
} from "constants/routes";
import type { UserRoleType } from "types/models/User";

export const checkRouteByRole = (role?: UserRoleType): string => {
  switch(role) {
    case "CourseProvider":
      return CourseProviderRoutes.courses;
    case "SuperAdmin":
      return AdminRoutes.dashboard;
    case "SchoolAdmin":
      return SchoolAdminRoutes.dashboard;
    case "SchoolCourseProvider":
      return SchoolCourseProviderRoutes.courses;
    case "Teacher":
    case "Student":
      return UserRoutes.courses;
    default:
      return AuthRoutes.login;
  };
};