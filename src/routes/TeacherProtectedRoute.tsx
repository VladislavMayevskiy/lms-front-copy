import { Navigate, Outlet } from "react-router-dom";
import { authStore } from "stores/authStore";
import { localStore } from "stores/localStore";
import { checkRouteByRole } from "utils/checkRouteByRole";

const TeacherProtectedRoute = () => {
  const user = authStore((store) => store.user);
  const token = localStore((store) => store.token);
  const route = checkRouteByRole(user?.role);

  return token && (user?.role === "Teacher") ? <Outlet /> : <Navigate to={route} replace />;
};

export default TeacherProtectedRoute;