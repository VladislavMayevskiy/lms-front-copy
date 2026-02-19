import { Navigate, Outlet } from "react-router-dom";
import { authStore } from "stores/authStore";
import { localStore } from "stores/localStore";
import { checkRouteByRole } from "utils/checkRouteByRole";

const UserProtectedRoute = () => {
	const user = authStore((store) => store.user);
	const token = localStore((store) => store.token);
  const route = checkRouteByRole(user?.role);

  return token && (user?.role === "Student" || user?.role === "Teacher") ? <Outlet /> : <Navigate to={route} replace />;
};

export default UserProtectedRoute;
