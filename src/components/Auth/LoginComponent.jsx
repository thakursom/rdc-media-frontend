import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, setToken } from "../../services/api";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import * as Yup from "yup";

function LoginComponent() {
    const navigate = useNavigate();
    const [twoFactorRequired, setTwoFactorRequired] = useState(false);
    const [tempToken, setTempToken] = useState("");
    const [twoFactorCode, setTwoFactorCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

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

                    if (userData.twoFactorRequired) {
                        setTwoFactorRequired(true);
                        setTempToken(userData.tempToken);
                        toast.info("Two-Factor Authentication is required.");
                        return;
                    }

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

    const handle2FAVerify = async (e) => {
        e.preventDefault();
        if (!twoFactorCode) {
            toast.error("Please enter the 2FA code");
            return;
        }

        setIsVerifying(true);
        try {
            const result = await apiRequest("/verify-2fa", "POST", {
                tempToken,
                code: twoFactorCode,
            });

            if (result.success) {
                const userData = result.data;
                setToken(userData.token);
                localStorage.setItem("token", userData.token);
                localStorage.setItem("user", JSON.stringify(userData.user));

                toast.success("Login successful!");
                navigate("/dashboard");
            } else {
                toast.error(result?.data?.message || "Invalid 2FA code");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong during 2FA verification");
        } finally {
            setIsVerifying(false);
        }
    };

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
                            onSubmit={twoFactorRequired ? handle2FAVerify : formik.handleSubmit}
                        >

                            {!twoFactorRequired ? (
                                <>
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
                                </>
                            ) : (
                                <div className="login-2fa-container shadow-lg">
                                    <div className="text-center mb-4">
                                        <i className="fa fa-shield fa-3x text-white mb-3"></i>
                                        <h4 className="text-white fw-bold">Verification Code</h4>
                                        <p className="text-white-50">Enter the 6-digit code from your authenticator app</p>
                                    </div>

                                    <div className="form-group mb-4 d-flex justify-content-center">
                                        <input
                                            className="form-control otp-input"
                                            type="text"
                                            inputMode="numeric"
                                            pattern="[0-9]*"
                                            placeholder="******"
                                            value={twoFactorCode}
                                            onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                                            maxLength={6}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="text-center">
                                        <small className="text-white-50 opacity-75">
                                            Open Google Authenticator or your preferred app to see the code.
                                        </small>
                                    </div>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className={twoFactorRequired ? "contact d-flex flex-column align-items-center gap-3 mt-4" : "contact d-flex justify-content-center mt-4"}>

                                <button
                                    type="submit"
                                    className={twoFactorRequired ? "btn sign-in w-75" : "btn sign-in"}
                                    disabled={isVerifying}
                                >
                                    {twoFactorRequired ? (isVerifying ? "Verifying..." : "Verify Code") : "Sign in"}
                                </button>

                                {!twoFactorRequired ? (
                                    <div
                                        className="btn contact-us"
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                    >
                                        Contact Us
                                    </div>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn-link text-white-50 text-decoration-none"
                                        onClick={() => setTwoFactorRequired(false)}
                                    >
                                        <i className="fa fa-arrow-left me-2"></i>Back to Login
                                    </button>
                                )}

                            </div>

                        </form>

                    </div>
                </div>
            </section>
        </div>
    );
}

export default LoginComponent;
