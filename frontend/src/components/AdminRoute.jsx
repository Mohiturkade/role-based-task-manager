import { Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

function AdminRoute({ children }) {
  const { token, role } = useAuth();

  // User is not logged in
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // User is logged in but not an admin
  if (role !== "Admin") {
    return <Navigate to="/dashboard" replace />;
  }

  // Admin can access the page
  return children;
}

export default AdminRoute;