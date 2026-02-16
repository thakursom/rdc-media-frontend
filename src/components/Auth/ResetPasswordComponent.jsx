import { useNavigate, useParams } from "react-router-dom";
import { apiRequest } from "../../../src/services/api";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

function ResetPasswordComponent() {
    const navigate = useNavigate();
    const { token } = useParams();

    const validationSchema = Yup.object({
        password: Yup.string()
            .required("Password is required"),

        confirmPassword: Yup.string()
            .oneOf([Yup.ref("password")], "Passwords must match")
            .required("Confirm password is required"),
    });

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema,

        onSubmit: async (values) => {
            try {
                const result = await apiRequest(
                    `/reset-password/${token}`,
                    "POST",
                    { newPassword: values.password }
                );

                if (result.success) {
                    toast.success("Password updated successfully!");

                    setTimeout(() => navigate("/"), 1500);
                } else {
                    toast.error(
                        result?.data?.message ||
                        "Something went wrong!"
                    );
                }

            } catch (error) {
                console.error(error);
                toast.error("Server error. Try again.");
            }
        },
    });

    return (
        <div className="form-background login-form">
            <section className="form-section">
                <div className="form-mainbox">
                    <div className="form-text">

                        {/* Logo */}
                        <div className="form-logo">
                            <img
                                src="../assets/Img/images.jpg"
                                alt="logo"
                            />
                        </div>

                        {/* Form */}
                        <form
                            className="form"
                            onSubmit={formik.handleSubmit}
                        >
                            <h5 className="mb-3 text-center">
                                Reset Password
                            </h5>

                            {/* New Password */}
                            <div className="form-group">

                                <label className="form-label">
                                    New Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    className="form-control"
                                    placeholder="Enter new password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />

                                {formik.touched.password &&
                                    formik.errors.password && (
                                        <small className="text-danger">
                                            {formik.errors.password}
                                        </small>
                                    )}

                            </div>

                            {/* Confirm Password */}
                            <div className="form-group">

                                <label className="form-label">
                                    Confirm Password
                                </label>

                                <input
                                    type="password"
                                    name="confirmPassword"
                                    className="form-control"
                                    placeholder="Confirm password"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />

                                {formik.touched.confirmPassword &&
                                    formik.errors.confirmPassword && (
                                        <small className="text-danger">
                                            {formik.errors.confirmPassword}
                                        </small>
                                    )}

                            </div>

                            {/* Buttons */}
                            <div className="contact d-flex justify-content-center gap-2 mt-3">

                                <button
                                    type="submit"
                                    className="btn sign-in"
                                >
                                    Update Password
                                </button>

                                <button
                                    type="button"
                                    className="btn contact-us"
                                    onClick={() => navigate("/")}
                                >
                                    Back to Login
                                </button>

                            </div>

                        </form>

                    </div>
                </div>
            </section>
        </div>
    );
}

export default ResetPasswordComponent;
