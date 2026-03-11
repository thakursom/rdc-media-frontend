import { useState, useEffect } from "react";
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";

function TwoFactorSetup() {
    const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
    const [qrCodeUrl, setQrCodeUrl] = useState("");
    const [secret, setSecret] = useState("");
    const [code, setCode] = useState("");
    const [step, setStep] = useState(1); // 1: Status, 2: Setup (QR), 3: Verify
    const [isLoading, setIsLoading] = useState(false);
    const [showDisableModal, setShowDisableModal] = useState(false);
    const [disableCode, setDisableCode] = useState("");

    useEffect(() => {
        fetchUserStatus();
    }, []);

    const fetchUserStatus = async () => {
        setIsLoading(true);
        try {
            const result = await apiRequest("/get-profile", "GET", null, true);
            if (result.success) {
                const updatedUser = result.data.user;
                setIsTwoFactorEnabled(updatedUser.isTwoFactorEnabled || false);
                // Sync with local storage
                const localUser = JSON.parse(localStorage.getItem("user") || "{}");
                localStorage.setItem("user", JSON.stringify({ ...localUser, ...updatedUser }));
            } else {
                // Fallback to local storage if API fails
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                setIsTwoFactorEnabled(user.isTwoFactorEnabled || false);
            }
        } catch (error) {
            console.error(error);
            const user = JSON.parse(localStorage.getItem("user") || "{}");
            setIsTwoFactorEnabled(user.isTwoFactorEnabled || false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateQR = async () => {
        setIsLoading(true);
        try {
            const result = await apiRequest("/generate-2fa", "POST", null, true);
            if (result.success) {
                setQrCodeUrl(result.data.qrCodeUrl);
                setSecret(result.data.secret);
                setStep(2);
            } else {
                toast.error(result.data?.message || "Failed to generate QR code");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleEnable2FA = async () => {
        if (!code) {
            toast.error("Please enter the verification code");
            return;
        }

        setIsLoading(true);
        try {
            const result = await apiRequest("/enable-2fa", "POST", { code }, true);
            if (result.success) {
                toast.success("2FA enabled successfully!");
                // Update local storage user
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                user.isTwoFactorEnabled = true;
                localStorage.setItem("user", JSON.stringify(user));
                setIsTwoFactorEnabled(true);
                setStep(1);
            } else {
                toast.error(result.data?.message || "Invalid code");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDisable2FA = async () => {
        if (!disableCode) {
            toast.error("Please enter the verification code");
            return;
        }

        setIsLoading(true);
        try {
            const result = await apiRequest("/disable-2fa", "POST", { code: disableCode }, true);
            if (result.success) {
                toast.success("2FA disabled successfully!");
                const user = JSON.parse(localStorage.getItem("user") || "{}");
                user.isTwoFactorEnabled = false;
                localStorage.setItem("user", JSON.stringify(user));
                setIsTwoFactorEnabled(false);
                setShowDisableModal(false);
                setDisableCode("");
            } else {
                toast.error(result.data?.message || "Invalid code");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {!showDisableModal && (
                <div className="card shadow-lg border-0 two-factor-setup-card mt-5">
                    <div className="card-header py-3">
                        <h5 className="mb-0 fw-bold"><i className="fa fa-shield me-2"></i>Two-Factor Authentication (2FA)</h5>
                    </div>
                    <div className="card-body p-4">
                        {step === 1 && (
                            <div className="text-center login-2fa-container">
                                <div className={`mb-4 ${isTwoFactorEnabled ? 'two-factor-status-enabled' : 'two-factor-status-disabled'}`}>
                                    <i className={`fa ${isTwoFactorEnabled ? 'fa-check-circle' : 'fa-exclamation-triangle'} two-factor-status-icon`}></i>
                                    <h4 className="fw-bold mt-2">2FA is {isTwoFactorEnabled ? 'Enabled' : 'Disabled'}</h4>
                                </div>

                                <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '400px' }}>
                                    Protect your account with an extra layer of security. Scan a QR code with an authenticator app like Google Authenticator or Authy to get started.
                                </p>

                                {!isTwoFactorEnabled ? (
                                    <button
                                        className="btn btn-2fa-primary text-white px-5 py-3 fs-5"
                                        onClick={handleGenerateQR}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <><i className="fa fa-spinner fa-spin me-2"></i>Initializing...</> : "Set up Authenticator"}
                                    </button>
                                ) : (
                                    <div className="d-flex flex-column gap-2">
                                        <button
                                            className="btn btn-outline-danger px-4 py-2"
                                            onClick={() => setShowDisableModal(true)}
                                            disabled={isLoading}
                                        >
                                            Disable 2FA Security
                                        </button>
                                        <small className="text-muted">Disable 2FA only if you're switching devices.</small>
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 2 && (
                            <div className="text-center login-2fa-container">
                                <h5 className="fw-bold mb-3">Scan the QR Code</h5>
                                <p className="small text-muted mb-4">
                                    Open your authenticator app and scan the code below.
                                </p>

                                <div className="qr-code-wrapper mb-4">
                                    <img src={qrCodeUrl} alt="2FA QR Code" style={{ width: '220px', display: 'block' }} />
                                </div>

                                <div className="mb-4">
                                    <p className="small fw-bold mb-2 text-uppercase text-muted">Or enter this secret key manually:</p>
                                    <div className="d-flex justify-content-center align-items-center gap-2">
                                        <div className="secret-key-box flex-grow-1">{secret}</div>
                                        <button
                                            className="btn btn-light border"
                                            title="Copy Secret"
                                            onClick={() => {
                                                navigator.clipboard.writeText(secret);
                                                toast.success("Secret key copied!");
                                            }}
                                        >
                                            <i className="fa fa-copy"></i>
                                        </button>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-center gap-3">
                                    <button className="btn btn-light border px-4 py-2" onClick={() => setStep(1)}>
                                        <i className="fa fa-arrow-left me-2"></i>Back
                                    </button>
                                    <button className="btn btn-2fa-primary text-white px-4 py-2" onClick={() => setStep(3)}>
                                        Next: Verify Code <i className="fa fa-arrow-right ms-2"></i>
                                    </button>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="text-center login-2fa-container">
                                <div className="mb-4">
                                    <i className="fa fa-key fa-3x text-primary opacity-50 mb-3"></i>
                                    <h5 className="fw-bold mb-2">Verification Required</h5>
                                    <p className="small text-muted mb-0">
                                        Enter the 6-digit code from your app to complete the setup.
                                    </p>
                                </div>

                                <div className="otp-input-container">
                                    <input
                                        type="text"
                                        className="form-control otp-input"
                                        placeholder="******"
                                        maxLength={6}
                                        value={code}
                                        onChange={(e) => setCode(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                <div className="d-flex justify-content-center gap-3">
                                    <button className="btn btn-light border px-4 py-2" onClick={() => setStep(2)}>Back</button>
                                    <button
                                        className="btn btn-success px-5 py-2 fw-bold"
                                        onClick={handleEnable2FA}
                                        disabled={isLoading}
                                    >
                                        {isLoading ? <><i className="fa fa-spinner fa-spin me-2"></i>Verifying...</> : "Confirm & Enable 2FA"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Disable 2FA Modal */}
            {showDisableModal && (
                <div id="two-fa-modal" className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{ borderRadius: '15px' }}>
                            <div className="modal-header bg-danger text-white" style={{ borderRadius: '15px 15px 0 0' }}>
                                <h5 className="modal-title fw-bold">Disable 2FA Security</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowDisableModal(false)}></button>
                            </div>
                            <div className="modal-body p-4 text-center">
                                <i className="fa fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                                <h5 className="fw-bold">Are you sure?</h5>
                                <p className="text-muted small mb-4">
                                    Disabling Two-Factor Authentication will make your account less secure. Please enter your 6-digit code to confirm.
                                </p>

                                <div className="otp-input-container my-3">
                                    <input
                                        type="text"
                                        className="form-control otp-input mx-auto"
                                        placeholder="******"
                                        maxLength={6}
                                        value={disableCode}
                                        onChange={(e) => setDisableCode(e.target.value.replace(/\D/g, ""))}
                                        autoFocus
                                    />
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-3">
                                <button type="button" className="btn btn-light px-4" onClick={() => setShowDisableModal(false)}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-danger px-4"
                                    onClick={handleDisable2FA}
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Disabling..." : "Confirm Disable"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default TwoFactorSetup;
