import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import Dashboard from "../pages/Dashboard";
import Review from "../pages/Review";
import Catalogue from "../pages/Catalogue";
import AddRelease from "../pages/AddRelease";
import AddBulkRelease from "../pages/AddBulkRelease";
import ViewAllRelease from "../pages/ViewAllRelease";
import SavedRelease from "../pages/SavedRelease";
import RejectedRelease from "../pages/RejectedRelease";
import AddLabel from "../pages/AddLabel";
import ViewLabel from "../pages/ViewLabel";
import AddArtist from "../pages/AddArtist";
import ViewArtist from "../pages/ViewArtist";
import AddNewsletter from "../pages/AddNewsletter";
import ViewNewsletter from "../pages/ViewNewsletter";
import ViewTicket from "../pages/ViewTicket";
import ManageGenre from "../pages/ManageGenre";


function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Public Routes */}
                <Route
                    element={
                        <PublicRoute>
                            <AuthLayout />
                        </PublicRoute>
                    }
                >
                    <Route path="/" element={<Login />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                </Route>


                {/* SUPER ADMIN ROUTES */}
                <Route
                    element={
                        <ProtectedRoute allowedRoles={["Super Admin"]}>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/review" element={<Review />} />
                    <Route path="/catalogue" element={<Catalogue />} />
                    <Route path="/add-releases" element={<AddRelease />} />
                    <Route path="/bulk-release" element={<AddBulkRelease />} />
                    <Route path="/view-release" element={<ViewAllRelease />} />
                    <Route path="/saved-release" element={<SavedRelease />} />
                    <Route path="/rejected-release" element={<RejectedRelease />} />
                    <Route path="/add-label" element={<AddLabel />} />
                    <Route path="/view-label" element={<ViewLabel />} />
                    <Route path="/add-artist" element={<AddArtist />} />
                    <Route path="/view-artist" element={<ViewArtist />} />
                    <Route path="/add-newsletter" element={<AddNewsletter />} />
                    <Route path="/view-newsletter" element={<ViewNewsletter />} />
                    <Route path="/view-ticket" element={<ViewTicket />} />
                    <Route path="/genre" element={<ManageGenre />} />
                </Route>


                {/*  CHANGE PASSWORD FOR ALL LOGGED USERS  */}
                <Route
                    element={
                        <ProtectedRoute allowedRoles={["Super Admin", "Admin", "Manager", "Label", "Sub Label"]}>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    {/* <Route path="/change-password" element={<ChangePassword />} /> */}
                </Route>

                {/* 404 */}
                {/* <Route path="*" element={<NotFound />} /> */}

            </Routes>
        </BrowserRouter>

    );
}

export default AppRouter;
