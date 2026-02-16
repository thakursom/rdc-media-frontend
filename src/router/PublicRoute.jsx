import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (token) {
    if (user.role === "Super Admin") {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === "Admin") {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === "Manager") {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === "Label") {
      return <Navigate to="/dashboard" replace />;
    } else if (user.role === "Sub Label") {
      return <Navigate to="/dashboard" replace />;
    } else {
      // default redirect if role doesn't match
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default PublicRoute;
