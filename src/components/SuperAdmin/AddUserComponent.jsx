import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";

function AddUserComponent() {
    const [searchParams] = useSearchParams();
    const userId = searchParams.get("id");
    const isEdit = !!userId;

    const [loading, setLoading] = useState(isEdit);
    const navigate = useNavigate();

    // Dynamic validation schema depending on add/edit mode
    const validationSchema = Yup.object({
        name: Yup.string().trim().required("Name is required"),
        email: Yup.string().email("Invalid email format").required("Email is required"),
        phone: Yup.string().trim().required("Phone number is required"),
        role: Yup.string().required("Role is required"),
        password: isEdit
            ? Yup.string()
            : Yup.string().required("Password is required"),
        confirmPassword: isEdit
            ? Yup.string().oneOf([Yup.ref("password"), null], "Passwords must match")
            : Yup.string()
                .oneOf([Yup.ref("password"), null], "Passwords must match")
                .required("Confirm password is required"),
        third_party_username: Yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            role: "",
            third_party_username: ""
        },
        validationSchema,
        onSubmit: async (values) => {
            const payload = { ...values };
            delete payload.confirmPassword;
            if (isEdit && (payload.password === "********" || !payload.password)) {
                delete payload.password;
            }

            const method = isEdit ? "PUT" : "POST";
            const endpoint = isEdit ? `/update-user/${userId}` : "/create-user";

            try {
                const response = await apiRequest(endpoint, method, payload, true);
                if (response.success) {
                    toast.success(response.message);
                    navigate("/users");
                } else {
                    toast.error(response.message || "Operation failed");
                }
            } catch (error) {
                console.error("Error saving user:", error);
                toast.error("An error occurred while saving user");
            }
        },
    });

    useEffect(() => {
        if (isEdit) {
            const fetchUserDetails = async () => {
                try {
                    const response = await apiRequest(`/users?id=${userId}`, "GET", null, true);
                    if (response.success && response.data?.data?.length > 0) {
                        const user = response.data.data[0];
                        if (user) {
                            formik.setValues({
                                name: user.name || "",
                                email: user.email || "",
                                phone: user.phone || "",
                                role: user.role || "",
                                third_party_username: user.third_party_username || "",
                                password: "********",
                                confirmPassword: "********"
                            });
                        }
                    } else {
                        toast.error("User not found");
                        navigate("/users");
                    }
                } catch (error) {
                    console.error("Error fetching user details:", error);
                    toast.error("Failed to fetch user details");
                } finally {
                    setLoading(false);
                }
            };
            fetchUserDetails();
        }
    }, [userId, isEdit]);

    if (loading) return <Loader message="Loading user details..." />;

    return (
        <section className="right-sidebar" id="sidebarRight">
            <div className="add-subLabel-sec">
                <div className="add-subLab">
                    <div className="add-subLabel-heading">
                        <h6>{isEdit ? "Edit User" : "Add User"}</h6>
                    </div>
                </div>
                <div className="add-subLabel-mainbox">
                    <div className="add-subLabel-box">
                        <form onSubmit={formik.handleSubmit} className="add-subLabels-form">
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group add-sublab-group">
                                        <label className="form-label required">Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                                            name="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter full name"
                                        />
                                        {formik.touched.name && formik.errors.name && (
                                            <small className="text-danger">{formik.errors.name}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group add-sublab-group">
                                        <label className="form-label required">Email Address</label>
                                        <input
                                            type="email"
                                            className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                            name="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter email address"
                                        />
                                        {formik.touched.email && formik.errors.email && (
                                            <small className="text-danger">{formik.errors.email}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group add-sublab-group">
                                        <label className="form-label required">Phone Number</label>
                                        <input
                                            type="text"
                                            className={`form-control ${formik.touched.phone && formik.errors.phone ? 'is-invalid' : ''}`}
                                            name="phone"
                                            value={formik.values.phone}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter phone number"
                                        />
                                        {formik.touched.phone && formik.errors.phone && (
                                            <small className="text-danger">{formik.errors.phone}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group add-sublab-group">
                                        <label className="form-label required">Roles</label>
                                        <select
                                            className={`form-control form-select ${formik.touched.role && formik.errors.role ? 'is-invalid' : ''}`}
                                            name="role"
                                            value={formik.values.role}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        >
                                            <option value="">-- Choose Role --</option>
                                            <option value="Admin">Admin</option>
                                            <option value="Manager">Manager</option>
                                            <option value="Super Admin">Super Admin</option>
                                            <option value="User">User</option>
                                            <option value="Label">Label</option>
                                            <option value="Sub-label">Sub-label</option>
                                        </select>
                                        {formik.touched.role && formik.errors.role && (
                                            <small className="text-danger">{formik.errors.role}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group add-sublab-group">
                                        <label className="form-label required">Password</label>
                                        <input
                                            type="password"
                                            className={`form-control ${formik.touched.password && formik.errors.password ? 'is-invalid' : ''}`}
                                            name="password"
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="********"
                                        />
                                        {formik.touched.password && formik.errors.password && (
                                            <small className="text-danger">{formik.errors.password}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group add-sublab-group">
                                        <label className="form-label required">Confirm Password</label>
                                        <input
                                            type="password"
                                            className={`form-control ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'is-invalid' : ''}`}
                                            name="confirmPassword"
                                            value={formik.values.confirmPassword}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="********"
                                        />
                                        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                                            <small className="text-danger">{formik.errors.confirmPassword}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group add-sublab-group">
                                        <label className="form-label">Third Party Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="third_party_username"
                                            value={formik.values.third_party_username}
                                            onChange={formik.handleChange}
                                            placeholder="Enter third party username"
                                        />
                                    </div>
                                </div>

                                <div className="col-12 mt-3">
                                    <div className="form-group add-sublab-group">
                                        <button
                                            type="submit"
                                            className="btn request-btn"
                                            id="requestBtn"
                                            disabled={formik.isSubmitting}
                                        >
                                            {formik.isSubmitting ? "Saving..." : "Save"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default AddUserComponent;
