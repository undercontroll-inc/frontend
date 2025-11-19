import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Loading from "./shared/Loading";

// roles: array de userType permitidos (ex.: ['ADMIN'])
const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    console.log("ProtectedRoute: Showing loading...");
    return <Loading text="Verificando autenticação..." />;
  }

  if (!isAuthenticated) {
    console.log("ProtectedRoute: Not authenticated, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (roles && user && !roles.includes(user.userType)) {
    console.log("ProtectedRoute: User role not allowed, redirecting...");
    const fallback = user.userType === "ADMINISTRATOR" ? "/repairs" : "/my-repairs";
    return <Navigate to={fallback} replace />;
  }

  console.log("ProtectedRoute: Rendering children");
  return children;
};

export default ProtectedRoute;
