import React, { useState, useRef } from 'react'
import { toast } from 'react-toastify';
import { apiRequest } from '../../services/api';

function AddBulkReleaseComponent() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [agreed, setAgreed] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [showProceed, setShowProceed] = useState(false);
    const [isStoring, setIsStoring] = useState(false);
    const fileInputRef = useRef(null);

    const simulateUpload = () => {
        setIsUploading(true);
        setUploadProgress(0);
        setShowProceed(false);

        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setIsUploading(false);
                    setShowProceed(true);
                    return 100;
                }
                return prev + 5;
            });
        }, 150);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            simulateUpload();
        }
    };

    const handleUploadClick = () => {
        if (!agreed) {
            toast.error("Please agree to the Declaration & Indemnity before uploading.");
            return;
        }
        fileInputRef.current.click();
    };

    const handleProceed = async () => {
        if (!selectedFile) return;

        setIsStoring(true);
        const formData = new FormData();
        formData.append("zipFile", selectedFile);

        console.log("Proceeding with bulk upload to backend...");

        try {
            const response = await apiRequest("/bulk-upload-release", "POST", formData, true);

            if (response.success) {
                toast.success(response.data.message || "Bulk release uploaded and stored successfully!");
                console.log("Bulk upload success:", response.data);

                // Reset states
                setSelectedFile(null);
                setShowProceed(false);
                setUploadProgress(0);
                setAgreed(false);
            } else {
                toast.error(response.data.message || "Failed to store bulk release data.");
                console.error("Bulk upload failure:", response.data);
            }
        } catch (error) {
            toast.error("An error occurred during bulk upload.");
            console.error("Bulk upload exception:", error);
        } finally {
            setIsStoring(false);
        }
    };

    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="bulk-releases-section">
                    <div className="bulk-sec-heading d-flex justify-content-between align-items-center mb-3">
                        <h6 style={{ color: 'var(--bgPurple)', fontSize: '15px' }}>Add Bulk Releases</h6>
                    </div>

                    <div className="bulk-file-card border-0 shadow-sm mt-3" style={{ background: '#fff', padding: '25px', borderRadius: '8px' }}>
                        <div className="bulk-file-sec">
                            <div className="bulk-rel-guidlines">
                                <h6 className="fw-bold mb-3" style={{ fontSize: '14px', color: '#444' }}>Please follow the guidelines included in the files</h6>
                                <p className="mb-1" style={{ fontSize: '13px', color: '#666' }}>Do not try to alter the template in any way</p>
                                <p className="mb-1" style={{ fontSize: '13px', color: '#666' }}>(i.e.: by adding or removing columns or changing columns titles)</p>
                                <p className="mb-1" style={{ fontSize: '13px', color: '#666' }}>Note: UPC and Catalogue Number must be unique. Duplicate values are not allowed.</p>
                                <p className="mb-3" style={{ fontSize: '13px', color: '#666' }}>Your file is completed? Upload it.</p>
                            </div>

                            <div className="mt-4">
                                <div
                                    className="choose-bulk-mainbox"
                                    onClick={handleUploadClick}
                                    style={{
                                        maxWidth: '300px',
                                        borderStyle: 'dotted',
                                        borderColor: 'var(--bgPurple)',
                                        background: '#fff',
                                        opacity: agreed ? 1 : 0.6,
                                        cursor: agreed ? 'pointer' : 'not-allowed'
                                    }}
                                >
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        style={{ display: 'none' }}
                                        accept=".zip"
                                    />
                                    <div className="file-icon" style={{ background: 'var(--bgPurple)', borderRadius: '5px' }}>
                                        <i className="fa-solid fa-plus" />
                                    </div>
                                    <h5 style={{ fontSize: '13px', color: '#444', lineHeight: '1.5' }}>
                                        {selectedFile ? `Selected: ${selectedFile.name}` : "Upload zip files containing audio assets, artwork, and metadata"}
                                    </h5>
                                </div>
                            </div>

                            {isUploading && (
                                <div className="mt-4" style={{ maxWidth: '400px' }}>
                                    <p className="mb-2" style={{ fontSize: '13px', color: '#666' }}>Processing... {uploadProgress}%</p>
                                    <div className="progress" style={{ height: '10px', borderRadius: '5px' }}>
                                        <div
                                            className="progress-bar progress-bar-striped progress-bar-animated"
                                            role="progressbar"
                                            style={{ width: `${uploadProgress}%`, backgroundColor: '#31aaa1' }}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            {showProceed && (
                                <div className="mt-4">
                                    <button
                                        className="btn btn-primary"
                                        onClick={handleProceed}
                                        disabled={isStoring}
                                        style={{ background: '#0065ab', border: 'none', padding: '10px 30px', borderRadius: '5px' }}
                                    >
                                        {isStoring ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Storing...
                                            </>
                                        ) : "Proceed"}
                                    </button>
                                </div>
                            )}

                            <div className="declaration-section mt-4 pt-3">
                                <div className="d-flex align-items-start gap-2">
                                    <input
                                        type="checkbox"
                                        id="declarationCheck"
                                        className="mt-1"
                                        checked={agreed}
                                        onChange={(e) => setAgreed(e.target.checked)}
                                        style={{ accentColor: '#0065ab' }}
                                    />
                                    <div className="declaration-text">
                                        <label htmlFor="declarationCheck" className="fw-bold mb-1" style={{ fontSize: '14px', color: '#444', cursor: 'pointer' }}>
                                            Declaration & Indemnity
                                        </label>
                                        <div style={{ fontSize: '13px', color: '#666', lineHeight: '1.4' }}>
                                            <p className="mb-1">I/We confirm that the submitted content is accurate and that I/We hold all necessary rights and authorizations.</p>
                                            <p className="mb-1">I/We agree that RDC Media Pvt Ltd is not responsible for any infringement, ownership, or financial disputes, and</p>
                                            <p className="mb-0">I/We undertake to indemnify and hold RDC Media Pvt Ltd harmless against any third-party claims.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="template-status-card border-0 shadow-sm mt-4" style={{ background: '#fff', padding: '25px', borderRadius: '8px' }}>
                        <h6 className="fw-bold mb-3" style={{ fontSize: '14px', color: '#444' }}>Download Dummy Bulk Release Zip File.</h6>
                        <div className="section-btn-fx">
                            <button className="mainBtn bgPurple clWhite">
                                Download Dummy Zip (Default)
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AddBulkReleaseComponent
