import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));

    // If not logged in → go to login
    if (!token) return <Navigate to="/" replace />;

    // If route is restricted to roles
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // redirect based on role
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
            // if unknown role
            return <Navigate to="/" replace />;
        }
    }

    // ✅ Allowed → show page
    return children;
};

export default ProtectedRoute;
