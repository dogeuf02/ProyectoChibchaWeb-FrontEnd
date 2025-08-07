// components/RoleProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const RoleProtectedRoute = ({ requiredRole }) => {
  const { authenticated, role } = useAuth();

  if (!authenticated) return <Navigate to="/login" replace />;
  if (role !== requiredRole) return <Navigate to="/unauthorized" replace />;

  return <Outlet />; // Renderiza las rutas hijas si pasa la validación
};

export default RoleProtectedRoute;
