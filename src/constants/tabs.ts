import {
  AdminRoutes,
  SchoolAdminRoutes,
  CourseProviderRoutes,
  SchoolCourseProviderRoutes,
} from "./routes";
import type { UserRoleType } from "types/models/User";

type TabType = {
  label: string;
  path: string;
};

export const tabs: Record<UserRoleType, TabType[]> = {
  "SuperAdmin": [
    {
      label: "Dashboard",
      path: AdminRoutes.dashboard,
    },
    {
      label: "Districts",
      path: AdminRoutes.districts,
    },
    {
      label: "Schools",
      path: AdminRoutes.schools,
    },
    {
      label: "Users",
      path: AdminRoutes.users,
    },
  ],
  "CourseProvider": [
    {
      label: "Courses",
      path: CourseProviderRoutes.courses,
    }
  ],
  "Teacher": [],
  "Student": [],
  "SchoolAdmin": [
    {
      label: "Users",
      path: SchoolAdminRoutes.users,
    },
    {
      label: "Students",
      path: SchoolAdminRoutes.students
    },
    {
      label: "Dashboard",
      path: SchoolAdminRoutes.dashboard,
    },
    {
      label: "Billing",
      path: SchoolAdminRoutes.billing
    },
  ],
  "SchoolCourseProvider": [
    {
      label: "Courses",
      path: SchoolCourseProviderRoutes.courses,
    },
  ],
};