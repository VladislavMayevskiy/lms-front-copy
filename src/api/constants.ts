const ApiBase = '/api';
const ApiBaseAuth = `${ApiBase}/auth`;
const ApiBaseAdmin = `${ApiBase}/admin`;
const ApiBaseAdminDashboard = `${ApiBaseAdmin}/dashboard`;
const ApiBaseUser = `${ApiBase}/user`;

export const FormDataHeader = {
  'Content-Type': 'multipart/form-data',
};

export const AuthApiRoutes = {
  login: `${ApiBaseAuth}/login`,
  register: `${ApiBaseAuth}/register`,
  social: `${ApiBaseAuth}/social`,
  forgotPassword: `${ApiBaseAuth}/forgot-password`,
  resetPassword: `${ApiBaseAuth}/reset-password`,
};

export const AdminApiRoutes = {
  districts: `${ApiBaseAdmin}/districts`,
  import: `${ApiBaseAdmin}/import`,
  importUsers: `${ApiBaseAdmin}/import/users`,
  regions: `${ApiBaseAdmin}/regions`,
  schools: `${ApiBaseAdmin}/schools`,
  users: `${ApiBaseAdmin}/users`,
  dashboardTotalCourses: `${ApiBaseAdminDashboard}/total-courses`,
  dashboardActiveSubscriptions: `${ApiBaseAdminDashboard}/active-subscriptions`,
  dashboardMostPopularCourse: `${ApiBaseAdminDashboard}/most-popular-course`,
  dashboardNewUsers: `${ApiBaseAdminDashboard}/new-users`,
  activity: (userId: number) => `${ApiBaseAdmin}/users/${userId}/activity`,
  assignedCourses: (userId: number) => `${ApiBaseAdmin}/users/${userId}/courses`,
  subscription: (schoolId: number) => `${ApiBaseAdmin}/schools/${schoolId}/subscription`,
  billing: (schoolId: number) => `${ApiBaseAdmin}/schools/${schoolId}/billing`,
  invoice: (schoolId: number) => `${ApiBaseAdmin}/schools/${schoolId}/invoices`,
  totalStudents: `${ApiBaseAdminDashboard}/total-students`
};

export const AdminLanguagesApiRoutes = {
  languages: `${ApiBaseAdmin}/languages`,
};

export const CourseProviderApiRoutes = {
  courses: `${ApiBaseAdmin}/courses`,
  courseModules: (courseId: number) => `${ApiBaseAdmin}/courses/${courseId}/modules`,
  modules: `${ApiBaseAdmin}/modules`,
  unitSections: (unitId: number) => `${ApiBaseAdmin}/units/${unitId}/sections`,
  sections: `${ApiBaseAdmin}/sections`,
  moduleUnits: (moduleId: number) => `${ApiBaseAdmin}/modules/${moduleId}/units`,
  units: `${ApiBaseAdmin}/units`,
  quiz: (unitId: number) => `${ApiBaseAdmin}/units/${unitId}/quiz`,
  generateQuiz: (unitId: number) => `${ApiBaseAdmin}/units/${unitId}/generate-quiz`,
  // Translations
  courseTranslations: (courseId: number) => `${ApiBaseAdmin}/courses/${courseId}/translations`,
  courseTranslation: (courseId: number, language: string) => `${ApiBaseAdmin}/courses/${courseId}/translations/${language}`,
  moduleTranslations: (moduleId: number) => `${ApiBaseAdmin}/modules/${moduleId}/translations`,
  moduleTranslation: (moduleId: number, language: string) => `${ApiBaseAdmin}/modules/${moduleId}/translations/${language}`,
  sectionTranslations: (sectionId: number) => `${ApiBaseAdmin}/sections/${sectionId}/translations`,
  sectionTranslation: (sectionId: number, language: string) => `${ApiBaseAdmin}/sections/${sectionId}/translations/${language}`,
  unitTranslations: (unitId: number) => `${ApiBaseAdmin}/units/${unitId}/translations`,
  unitTranslation: (unitId: number, language: string) => `${ApiBaseAdmin}/units/${unitId}/translations/${language}`,
};

export const UserApiRoutes = {
  courses: `${ApiBase}/courses`,
  startCourse: (courseId: number) => `${ApiBase}/courses/${courseId}/start`,
  finishModule: (moduleId: number) => `${ApiBase}/modules/${moduleId}/finish`,
  plans: `${ApiBase}/plans`,
  subscription: `${ApiBaseUser}/subscription`,
  myCourses: `${ApiBaseUser}/courses`,
  profile: `${ApiBaseUser}/profile`,
  password: `${ApiBaseUser}/password`,
  deleteAccount: `${ApiBaseUser}/profile/delete`,
  image: `${ApiBaseUser}/image`,
  schools: `${ApiBase}/schools`,
  activity: `${ApiBaseUser}/activity`,
  invoices: `${ApiBaseUser}/invoices`,
  quiz: (unitId: number) => `${ApiBase}/units/${unitId}/quiz`,
  completeUnit: (unitId: number) => `${ApiBase}/units/${unitId}/complete`,
  billing: `${ApiBaseUser}/billing`,
  showCourse: (courseId: number) =>`${ApiBase}/courses/${courseId}`, 
  settings: `${ApiBaseUser}/settings`,
  finishUnit: (unitId: number) => `${ApiBase}/units/${unitId}/complete`,
  purchaseCourse: (courseId: number) => `${ApiBase}/courses/${courseId}/purchase`,
  quiz_result: (unitId: number) => `${ApiBase}/units/${unitId}/quiz-result`,
  quizAnalyticsCourse: (courseId: number) => `${ApiBase}/teacher/courses/${courseId}/quiz-analytics`,
  quizAnalyticsUnit: (unitId: number) => `${ApiBase}/teacher/units/${unitId}/quiz-analytics`,
  teacherStudents: `${ApiBase}/teacher/students`,
  teacherStudentCourses: (userId: number) => `${ApiBase}/teacher/students/${userId}/courses`,
  teacherStudentCourseQuizResults: (userId: number, courseId: number) =>
    `${ApiBase}/teacher/students/${userId}/courses/${courseId}/quiz-results`,
};
