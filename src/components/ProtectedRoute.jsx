import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "./shared/Loading";

// roles: array de userType permitidos (ex.: ['ADMIN'])
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <Loading text="Verificando autenticação..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.userType)) {
    const fallback = user.userType === "ADMINISTRATOR" ? "/dashboard" : "/repairs";
    return <Navigate to={fallback} replace />;
  }

  return children;
};

export default ProtectedRoute;
