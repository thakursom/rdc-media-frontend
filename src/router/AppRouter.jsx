import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AuthLayout from "../layouts/AuthLayout";
import DashboardLayout from "../layouts/DashboardLayout";
import Login from "../pages/Auth/Login";
import ForgotPassword from "../pages/Auth/ForgotPassword";
import ResetPassword from "../pages/Auth/ResetPassword";
import Home from "../pages/Home";
import Dashboard from "../pages/SuperAdmin/Dashboard";
import Review from "../pages/SuperAdmin/Review";
import Catalogue from "../pages/SuperAdmin/Catalogue";
import AddRelease from "../pages/SuperAdmin/AddRelease";
import AddBulkRelease from "../pages/SuperAdmin/AddBulkRelease";
import ViewAllRelease from "../pages/SuperAdmin/ViewAllRelease";
import SavedRelease from "../pages/SuperAdmin/SavedRelease";
import RejectedRelease from "../pages/SuperAdmin/RejectedRelease";
import AddLabel from "../pages/SuperAdmin/AddLabel";
import ViewLabel from "../pages/SuperAdmin/ViewLabel";
import AddArtist from "../pages/SuperAdmin/AddArtist";
import ViewArtist from "../pages/SuperAdmin/ViewArtist";
import AddNewsletter from "../pages/SuperAdmin/AddNewsletter";
import ViewNewsletter from "../pages/SuperAdmin/ViewNewsletter";
import ViewTicket from "../pages/SuperAdmin/ViewTicket";
import ManageGenre from "../pages/SuperAdmin/ManageGenre";
import ManageSubGenre from "../pages/SuperAdmin/ManageSubGenre";
import ManageDSP from "../pages/SuperAdmin/ManageDSP";
import ManageUser from "../pages/SuperAdmin/ManageUser";
import AddUser from "../pages/SuperAdmin/AddUser";


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
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
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
                    <Route path="/edit-artist/:id" element={<AddArtist />} />
                    <Route path="/view-artist" element={<ViewArtist />} />
                    <Route path="/add-newsletter" element={<AddNewsletter />} />
                    <Route path="/view-newsletter" element={<ViewNewsletter />} />
                    <Route path="/view-ticket" element={<ViewTicket />} />
                    <Route path="/genre" element={<ManageGenre />} />
                    <Route path="/sub-genre" element={<ManageSubGenre />} />
                    <Route path="/dsp" element={<ManageDSP />} />
                    <Route path="/users" element={<ManageUser />} />
                    <Route path="/add-user" element={<AddUser />} />
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
