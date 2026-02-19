import { Navigate, Outlet } from "react-router-dom";
import { authStore } from "stores/authStore";
import { localStore } from "stores/localStore";
import { checkRouteByRole } from "utils/checkRouteByRole";

const AuthProtectedRoute = () => {
	const user = authStore((store) => store.user);
	const token = localStore((store) => store.token);
  const route = checkRouteByRole(user?.role);

  return !token && !user ? <Outlet /> : <Navigate to={route} replace />;
};

export default AuthProtectedRoute;