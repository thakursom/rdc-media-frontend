import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../../src/services/api";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

function ForgotPasswordComponent() {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema,

        onSubmit: async (values) => {
            try {
                const result = await apiRequest(
                    "/forgot-password",
                    "POST",
                    { email: values.email }
                );

                if (result.success) {
                    toast.success(
                        result.data.message ||
                        "Reset link sent to your email"
                    );

                    // optional redirect
                    setTimeout(() => navigate("/"), 1500);

                } else {
                    toast.error(
                        result.data.message ||
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
                                Forgot Password
                            </h5>

                            {/* Email */}
                            <div className="form-group">

                                <label className="form-label">
                                    Registered Email
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    placeholder="Enter your email"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />

                                {formik.touched.email &&
                                    formik.errors.email && (
                                        <small className="text-danger">
                                            {formik.errors.email}
                                        </small>
                                    )}

                            </div>

                            {/* Buttons */}
                            <div className="contact d-flex justify-content-center gap-2 mt-3">

                                <button
                                    type="submit"
                                    className="btn sign-in"
                                >
                                    Send Reset Link
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

export default ForgotPasswordComponent;
