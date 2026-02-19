const AdminBaseRoute = "/admin";
const SchoolAdminBaseRoute = "/school-admin"
const CourseProviderBaseRoute = "/course-provider"; 
const SchoolCourseProviderBaseRoute = "/school-course-provider"; 

export const AdminRoutes = {
  districts: `${AdminBaseRoute}/districts`,
  schools: `${AdminBaseRoute}/schools`,
  users: `${AdminBaseRoute}/users`,
  settings: `${AdminBaseRoute}/settings`,
  dashboard: `${AdminBaseRoute}/dashboard`,
};

export const SchoolAdminRoutes = {
  users: `${SchoolAdminBaseRoute}/users`,
  settings: `${SchoolAdminBaseRoute}/settings`,
  dashboard: `${SchoolAdminBaseRoute}/dashboard`,
  billing: `${SchoolAdminBaseRoute}/billing`,
  students: `${SchoolAdminBaseRoute}/students`
};

export const CourseProviderRoutes = {
  courses: `${CourseProviderBaseRoute}/courses`,
  modules: `${CourseProviderBaseRoute}/courses/:id/modules`,
  units: `${CourseProviderBaseRoute}/courses/:id/modules/:moduleId/units`,
  sections: `${CourseProviderBaseRoute}/courses/:id/modules/:moduleId/units/:unitId/sections`,
  settings: `${CourseProviderBaseRoute}/settings`,
};

export const SchoolCourseProviderRoutes = {
  courses: `${SchoolCourseProviderBaseRoute}/courses`,
  modules: `${SchoolCourseProviderBaseRoute}/courses/:id/modules`,
  units: `${SchoolCourseProviderBaseRoute}/courses/:id/modules/:moduleId/units`,
  sections: `${SchoolCourseProviderBaseRoute}/courses/:id/modules/:moduleId/units/:unitId/sections`,
  settings: `${SchoolCourseProviderBaseRoute}/settings`,
};

export const UserRoutes = {
  courses: "/courses",
  myCourses: "/my-courses",
  profile: "/profile",
  settings: "/settings",
  billing: "/billing",
  courseShow: "/courses",
  startCourse: "/learn",
  teacher: "/teacher",
  studentCourse: "/teacher/:id/courses",
  quiz: "/teacher/:id/courses/:courseId/quiz"
};

export const AuthRoutes = {
  landing: "/",
  login: "/login",
  createAccount: "/create-account",
  forgotPassword: "/forgot-password",
};