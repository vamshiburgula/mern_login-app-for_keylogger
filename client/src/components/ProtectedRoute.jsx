import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";

const ProtectedRoute = ({ children, role, loadingFallback = null }) => {
  const { isLoggedin, userData, isLoading } = useContext(AppContent);

  if (isLoading) {
    return loadingFallback || <div>Loading authentication...</div>;
  }

  if (!isLoggedin) {
    return <Navigate to="/login" replace />;
  }

  if (role && userData?.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
