import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/" state={{ from: location, requireLogin: true }} replace />;
  }

  return children;
};

export default ProtectedRoute;
