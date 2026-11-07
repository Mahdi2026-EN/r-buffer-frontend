import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "../../services/auth";

// Protects the customer and admin areas. Without a valid session the visitor is sent to the login page.
export function RequireAuth({ role }: { role?: "admin" | "user" }) {
  const location = useLocation();
  const token = authService.getToken();
  const user = authService.getCurrentUser();

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === "admin" ? "/admin" : "/dashboard"} replace />;
  }

  return <Outlet />;
}
