import { useNavigate } from "react-router-dom";
import { apiRequest, setToken } from "../../services/api";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

function LoginComponent() {
    const navigate = useNavigate();

    // validation schema
    const validationSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email format")
            .required("Email is required"),
        password: Yup.string().required("Password is required"),
        remember: Yup.boolean(),
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            remember: false,
        },
        validationSchema,

        onSubmit: async (values) => {
            try {
                const result = await apiRequest("/login", "POST", {
                    email: values.email,
                    password: values.password,
                });

                if (result.success) {
                    const userData = result.data;

                    // save auth
                    setToken(userData.token);
                    localStorage.setItem("token", userData.token);
                    localStorage.setItem(
                        "user",
                        JSON.stringify(userData.user)
                    );

                    toast.success("Login successful!");

                    // role navigation
                    const role = userData.user.role;

                    if (role === "Super Admin") navigate("/dashboard");
                    else if (role === "Admin") navigate("/dashboard");
                    else if (role === "Manager") navigate("/dashboard");
                    else if (role === "Label") navigate("/dashboard");
                    else if (role === "Sub Label") navigate("/dashboard");
                    else navigate("/dashboard");

                } else {
                    toast.error(
                        result?.data?.message ||
                        "Invalid Username or Password!"
                    );
                }
            } catch (error) {
                console.error(error);
                toast.error("Something went wrong");
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
                            <img src="../assets/Img/images.jpg" alt="" />
                        </div>

                        <form
                            className="form"
                            onSubmit={formik.handleSubmit}
                        >

                            {/* Email */}
                            <div className="form-group">
                                <label className="form-label">Email</label>

                                <input
                                    className="form-control"
                                    type="email"
                                    name="email"
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

                            {/* Password */}
                            <div className="form-group">
                                <label className="form-label">Password</label>

                                <input
                                    className="form-control"
                                    type="password"
                                    name="password"
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

                            {/* Remember + Forgot */}
                            <div className="remember-data d-flex justify-content-between">

                                <div className="remember">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        checked={formik.values.remember}
                                        onChange={formik.handleChange}
                                    />
                                    <label>Remember me</label>
                                </div>

                                <div className="forget-pass">
                                    <button
                                        type="button"
                                        className="forget-pass-btn"
                                        onClick={() =>
                                            navigate("/forgot-password")
                                        }
                                    >
                                        Forget Password?
                                    </button>
                                </div>

                            </div>

                            {/* Buttons */}
                            <div className="contact d-flex justify-content-center">

                                <button
                                    type="submit"
                                    className="btn sign-in"
                                >
                                    Sign in
                                </button>

                                <div
                                    className="btn contact-us"
                                    data-bs-toggle="modal"
                                    data-bs-target="#exampleModal"
                                >
                                    Contact Us
                                </div>

                            </div>

                        </form>

                    </div>
                </div>
            </section>
        </div>
    );
}

export default LoginComponent;
