import { Routes, Route } from "react-router-dom";

import AuthProtectedRoute from "./AuthProtectedRoute";
import AdminProtectedRoute from "./AdminProtectedRoute";
import SchoolAdminProtectedRoute from "./SchoolAdminProtectedRoute";
import CourseProviderProtectedRoute from "./CourseProviderProtectedRoute";
import SchoolCourseProviderProtectedRoute from "./SchoolCourseProviderProtectedRoute";
import UserProtectedRoute from "./UserProtectedRoute";
import TeacherProtectedRoute from "./TeacherProtectedRoute";

import LandingPage from "app/page";
import LoginPage from "app/auth/login/page";
import CreateAccountPage from "app/auth/create-account/page";
import ForgotPasswordPage from "app/auth/forgot-password/page";
import PrivacyPolicyPage from "app/privacy-policy/page";
import TermsAndConditionsPage from "app/terms-and-conditions/page";

import AdminDistricsPage from "app/admin/districs/page";
import AdminSchoolsPage from "app/admin/schools/page";
import AdminUsersPage from "app/admin/users/page";
import AdminCommunityPage from "app/admin/commmunity/page";
import AdminSettingsPage from "app/admin/settings/page";
import AdminDashboardPage from "app/admin/dashboard/page";
import AdminUsersInfoPage from "app/admin/users/user-info/page";

import SchoolAdminUsersPage from "app/school-admin/users/page";
import SchoolAdminSettingsPage from "app/school-admin/settings/page";
import SchoolAdminDashboardPage from "app/school-admin/dashboard/page";
import SchoolAdminBillingPage from "app/school-admin/billing/page";
import SchoolAdminStudentsPage from "app/school-admin/students/page";

import CourseProviderCoursesPage from "app/course-provider/courses/page";
import CourseProviderModulesPage from "app/course-provider/courses/[id]/modules/page";
import CourseProviderUnitsPage from "app/course-provider/courses/[id]/modules/[moduleId]/units/page";
import CourseProviderSectionsPage from "app/course-provider/courses/[id]/modules/[moduleId]/units/[unitId]/sections/page";
import CourseProviderSettingsPage from "app/course-provider/settings/page";

import SchoolCourseProviderCoursesPage from "app/school-course-provider/courses/page";
import SchoolCourseProviderModulesPage from "app/school-course-provider/courses/[id]/modules/page";
import SchoolCourseProviderUnitsPage from "app/school-course-provider/courses/[id]/modules/[moduleId]/units/page";
import SchoolCourseProviderSectionsPage from "app/school-course-provider/courses/[id]/modules/[moduleId]/units/[unitId]/sections/page";
import SchoolCourseProviderSettingsPage from "app/school-course-provider/courses/settings/page";

import CoursesPage from "app/(user)/courses/page";
import MyCoursesPage from "app/(user)/my-courses/page";
import ProfilePage from "app/(user)/profile/page";
import SettingsPage from "app/(user)/settings/page";
import ShowCoursePage from "app/(user)/courses/show/page";
import LearnCoursePage from "app/(user)/courses/learn";

import {
	AdminRoutes,
	SchoolAdminRoutes,
	AuthRoutes,
	CourseProviderRoutes,
	SchoolCourseProviderRoutes,
	UserRoutes,
} from "constants/routes";
import TeacherPage from "app/(user)/teacher/page";
import StudentsCoursePage from "app/(user)/teacher/students-course/page";
import StudentsQuizPage from "app/(user)/teacher/quiz/page";

export const AppRoutes = () => {
	return (
		<Routes>
			<Route element={<AuthProtectedRoute />}>
				<Route
					key="auth-routes-landing"
					path={AuthRoutes.landing}
					element={<LandingPage />}
				/>
				<Route
					key="auth-routes-login"
					path={AuthRoutes.login}
					element={<LoginPage />}
				/>
				<Route
					key="auth-routes-create-account"
					path={AuthRoutes.createAccount}
					element={<CreateAccountPage />}
				/>
				<Route
					key="auth-routes-forgot-password"
					path={AuthRoutes.forgotPassword}
					element={<ForgotPasswordPage />}
				/>
			</Route>
			{/* Start Admin Routes */}
			<Route element={<AdminProtectedRoute />}>
				<Route
					key="admin-routes-districs"
					path={AdminRoutes.districts}
					element={<AdminDistricsPage />}
				/>
				<Route
					path={AdminRoutes.schools}
					element={<AdminSchoolsPage />}
				/>
				<Route	path={AdminRoutes.users}>
					<Route index element={<AdminUsersPage />} />
					<Route path=":userId" element={<AdminUsersInfoPage />} />
				</Route>
 			    <Route path={AdminRoutes.districts}>
   					 <Route index element={<AdminDistricsPage />} />
    				 <Route path=":districtId" element={<AdminCommunityPage />} />
 			     </Route>
				<Route
					key="admin-routes-settings"
					path={AdminRoutes.settings}
					element={<AdminSettingsPage  />}
				/>
				<Route
					key="admin-routes-dashboard"
					path={AdminRoutes.dashboard}
					element={<AdminDashboardPage  />}
				/>
			</Route>
			{/* End Admin Routes */}
			{/* Start School Admin Routes */}
			<Route element={<SchoolAdminProtectedRoute />}>
				<Route	path={SchoolAdminRoutes.users}>
					<Route index element={<SchoolAdminUsersPage/>} />
					<Route path=":userId" element={<AdminUsersInfoPage />} />
				</Route>
				<Route
					key="school-admin-routes-students"
					path={SchoolAdminRoutes.students}
					element={<SchoolAdminStudentsPage />}
				/>
				<Route
					key="school-admin-routes-settings"
					path={SchoolAdminRoutes.settings}
					element={<SchoolAdminSettingsPage  />}
				/>
				<Route
					key="school-admin-routes-dashboard"
					path={SchoolAdminRoutes.dashboard}
					element={<SchoolAdminDashboardPage  />}
				/>
				<Route
					key="school-admin-routes-billing"
					path={SchoolAdminRoutes.billing}
					element={<SchoolAdminBillingPage/>}
				
				/>
			</Route>
			{/* End School Admin Routes */}
			{/* Start Course Provider Routes */}
			<Route element={<CourseProviderProtectedRoute />}>
				<Route
					key="course-provider-routes-courses"
					path={CourseProviderRoutes.courses}
					element={<CourseProviderCoursesPage />}
				/>
				<Route
					key="course-provider-routes-modules"
					path={CourseProviderRoutes.modules}
					element={<CourseProviderModulesPage />}
				/>
				<Route
					key="course-provider-routes-units"
					path={CourseProviderRoutes.units}
					element={<CourseProviderUnitsPage />}
				/>
				<Route
					key="course-provider-routes-sections"
					path={CourseProviderRoutes.sections}
					element={<CourseProviderSectionsPage />}
				/>
				<Route
					key="course-provider-routes-settings"
					path={CourseProviderRoutes.settings}
					element={<CourseProviderSettingsPage />}
				/>
			</Route>
			{/* End Course Provider Routes */}
			{/* Start School Course Provider Routes */}
			<Route element={<SchoolCourseProviderProtectedRoute />}>
				<Route
					key="school-course-provider-routes-courses"
					path={SchoolCourseProviderRoutes.courses}
					element={<SchoolCourseProviderCoursesPage />}
				/>
				<Route
					key="school-course-provider-routes-modules"
					path={SchoolCourseProviderRoutes.modules}
					element={<SchoolCourseProviderModulesPage />}
				/>
				<Route
					key="school-course-provider-routes-units"
					path={SchoolCourseProviderRoutes.units}
					element={<SchoolCourseProviderUnitsPage />}
				/>
				<Route
					key="school-course-provider-routes-sections"
					path={SchoolCourseProviderRoutes.sections}
					element={<SchoolCourseProviderSectionsPage />}
				/>
				<Route
					key="school-course-provider-routes-settings"
					path={SchoolCourseProviderRoutes.settings}
					element={<SchoolCourseProviderSettingsPage />}
				/>
			</Route>
			{/* End School Course Provider Routes */}
			{/* Start User Routes */}
			<Route element={<UserProtectedRoute />}>
				<Route
					key="user-routes-courses"
					path={UserRoutes.courses}
					element={<CoursesPage />}
				/>
				<Route
					key="user-routes-my-courses"
					path={UserRoutes.myCourses}
					element={<MyCoursesPage />}
				/>
				<Route
					key="user-routes-profile"
					path={UserRoutes.profile}
					element={<ProfilePage/>}
				/>
				<Route
					key="user-routes-settings"
					path={UserRoutes.settings}
					element={<SettingsPage/>}
				/>
				<Route
					key="user-routes-show-courses"
					path="/courses/:id"
					element={<ShowCoursePage/>}
				/>
				<Route
					key="user-routes-show-courses"
					path="/learn/:id"
					element={<LearnCoursePage/>}
				/>
				<Route
					key="user-routes-show-courses"
					path="/learn/:id/:unitId"
					element={<LearnCoursePage/>}
				/>
			{/* Teacher-only routes — students are redirected to /courses */}
			<Route element={<TeacherProtectedRoute />}>
				<Route
					key="user-routes-teacher"
					path={UserRoutes.teacher}
					element={<TeacherPage/>}
				/>
				<Route
					key="user-routes-students-course"
					path={UserRoutes.studentCourse}
					element={<StudentsCoursePage/>}
				/>
				<Route
					key="user-routes-students-quiz"
					path={UserRoutes.quiz}
					element={<StudentsQuizPage/>}
				/>
			</Route>
			</Route>
			{/* End User Routes */}

			<Route
				key="public-privacy-policy"
				path={AuthRoutes.privacyPolicy}
				element={<PrivacyPolicyPage />}
			/>
			<Route
				key="public-terms-and-conditions"
				path={AuthRoutes.termsAndConditions}
				element={<TermsAndConditionsPage />}
			/>
		</Routes>
	);
};
