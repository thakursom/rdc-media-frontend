import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";

function ManageUPCComponent() {
    const [upcs, setUpcs] = useState([]);
    const [loading, setLoading] = useState(false);

    // Search and Filter States
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [appliedSearch, setAppliedSearch] = useState("");
    const [appliedStatus, setAppliedStatus] = useState("All");

    const [pagination, setPagination] = useState({
        totalDocs: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });

    // Modal States
    const [modalType, setModalType] = useState(null); // 'upload', 'edit', 'delete'
    const [selectedUPC, setSelectedUPC] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    // Upload Modal specific states
    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    // Validation for Edit Item
    const validationSchema = Yup.object({
        upc: Yup.string().trim().required("UPC is required"),
        ean: Yup.string().trim().required("EAN is required"),
    });

    const formik = useFormik({
        initialValues: {
            upc: selectedUPC?.upc || '',
            ean: selectedUPC?.ean || ''
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            try {
                const response = await apiRequest(`/update-upc/${selectedUPC.id || selectedUPC._id}`, "PUT", values, true);
                if (response.success) {
                    toast.success("UPC updated successfully");
                    handleCloseModal();
                    fetchUPCs(pagination.currentPage);
                } else {
                    toast.error(response?.data?.message || "Failed to update UPC");
                }
            } catch (error) {
                console.error("Update UPC error:", error);
                toast.error("An error occurred while updating UPC");
            }
        },
    });

    const fetchUPCs = async (page = 1, currentLimit = pagination.limit, search = appliedSearch, status = appliedStatus) => {
        setLoading(true);
        try {
            let endpoint = `/upcs?page=${page}&limit=${currentLimit}`;
            if (search) endpoint += `&search=${encodeURIComponent(search)}`;
            if (status !== "All") endpoint += `&status=${status}`;

            const response = await apiRequest(endpoint, "GET", null, true);
            if (response.success) {
                setUpcs(response?.data?.data || []);
                if (response?.data?.pagination) {
                    setPagination(response.data.pagination);
                }
            } else {
                toast.error(response?.data?.message || "Failed to fetch UPCs");
            }
        } catch (error) {
            console.error("Fetch UPCs error:", error);
            toast.error("An error occurred while fetching UPCs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUPCs(pagination.currentPage, pagination.limit, appliedSearch, appliedStatus);
    }, [pagination.currentPage, appliedSearch, appliedStatus]);

    const handleSearch = () => {
        setAppliedSearch(searchQuery);
        setAppliedStatus(statusFilter);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleReset = () => {
        setSearchQuery("");
        setStatusFilter("All");
        setAppliedSearch("");
        setAppliedStatus("All");
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handlePerPageChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
        fetchUPCs(1, newLimit, appliedSearch, appliedStatus);
    };

    // Export Logic
    const handleExportExcel = async () => {
        try {
            let endpoint = "/export-upc?";
            if (appliedSearch) endpoint += `search=${encodeURIComponent(appliedSearch)}&`;
            if (appliedStatus !== "All") endpoint += `status=${appliedStatus}`;

            const response = await apiRequest(endpoint, "GET", null, true, true);

            const url = window.URL.createObjectURL(response);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `UPC_Export_${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            toast.success("Export successful");
        } catch (error) {
            console.error("Export error:", error);
            toast.error(error.message || "Failed to export UPCs");
        }
    };

    // Shared Modal Handlers
    const handleOpenModal = (type, upc = null) => {
        setModalType(type);
        setSelectedUPC(upc);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedUPC(null);
        setSelectedFile(null);
        formik.resetForm();
    };

    // File Upload Handlers (for Bulk Add)
    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();
        if (!selectedFile) {
            toast.error("Please select an Excel file first");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await apiRequest("/upload-upc", "POST", formData, true);
            if (response.success) {
                toast.success(response?.data?.message || "UPCs uploaded successfully");
                handleCloseModal();
                fetchUPCs(1); // Refresh page 1
            } else {
                toast.error(response?.data?.message || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("An error occurred during upload");
        } finally {
            setIsUploading(false);
        }
    };

    // Toggle Status Inline via Checkbox (like Manage Country)
    const handleToggleStatus = async (upc) => {
        const newStatus = upc.status === 0 ? 1 : 0;
        try {
            const response = await apiRequest(`/update-upc-status/${upc.id || upc._id}`, "PUT", { status: newStatus }, true);
            if (response.success) {
                toast.success(`UPC status updated successfully`);
                fetchUPCs(pagination.currentPage);
            } else {
                toast.error(response?.data?.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Toggle status error:", error);
            toast.error("An error occurred while updating status");
        }
    };

    // Delete single UPC Item
    const handleDelete = async () => {
        if (!selectedUPC) return;
        setIsDeleting(true);
        try {
            const response = await apiRequest(`/delete-upc/${selectedUPC.id || selectedUPC._id}`, "DELETE", null, true);
            if (response.success) {
                toast.success("UPC deleted successfully");
                handleCloseModal();
                fetchUPCs(pagination.currentPage);
            } else {
                toast.error(response?.data?.message || "Failed to delete UPC");
            }
        } catch (error) {
            console.error("Delete UPC error:", error);
            toast.error("An error occurred while deleting the UPC");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="Audio-main-sec">
                    <div className="view-release" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                        <div className="view-release-heading my-0">
                            <h6 style={{ color: '#2db3a0', margin: 0 }}>View UPC</h6>
                        </div>

                        {/* Search and Filters Strip */}
                        <div className="d-flex align-items-center flex-wrap gap-2">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search UPC"
                                style={{ width: '250px' }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            <select
                                className="form-select"
                                style={{ width: '100px' }}
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setAppliedStatus(e.target.value);
                                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                                }}
                            >
                                <option value="All">All</option>
                                <option value="1">Enabled</option>
                                <option value="0">Disabled</option>
                            </select>

                            <button type="button" className="btn text-white" style={{ backgroundColor: '#2db3a0' }} onClick={handleSearch}>
                                Search
                            </button>
                            <button type="button" className="btn text-white" style={{ backgroundColor: '#6c757d' }} onClick={handleReset}>
                                Reset
                            </button>

                            <button type="button" className="btn text-white" style={{ backgroundColor: '#2db3a0' }} onClick={handleExportExcel}>
                                <i className="fa-regular fa-file-excel me-1"></i> Export Excel
                            </button>

                            <button
                                type="button"
                                className="btn text-white"
                                style={{ backgroundColor: '#2db3a0' }}
                                onClick={() => handleOpenModal('upload')}
                            >
                                +Add New UPC
                            </button>
                        </div>
                    </div>

                    <div className="viewReleases-main-sec audio-sec mt-3">
                        {loading ? (
                            <Loader message="Fetching UPCs..." variant="success" />
                        ) : (
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>Upc</th>
                                        <th>Ean</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {upcs.length > 0 ? (
                                        upcs.map((item, index) => (
                                            <tr key={item.id || item._id}>
                                                <td>{((pagination.currentPage - 1) * pagination.limit) + index + 1}</td>
                                                <td>{item.upc}</td>
                                                <td>{item.ean}</td>
                                                <td className="genreStatus">
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={item.status === 1}
                                                            onChange={() => handleToggleStatus(item)}
                                                            id={`status-${item.id || item._id}`}
                                                        />
                                                        <label className="form-check-label" htmlFor={`status-${item.id || item._id}`}>
                                                            {item.status === 1 ? "Enabled" : "Disabled"}
                                                        </label>
                                                    </div>
                                                </td>
                                                <td className="excel-button view-subLabels-btn manageGenre" id="subLabelsBtn">
                                                    <div className="manage-gen-btnBox">
                                                        <button
                                                            type="button"
                                                            className="btn excel"
                                                            id="subLabelsBtn"
                                                            onClick={() => handleOpenModal('edit', item)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn excel"
                                                            id="subLabelsDel"
                                                        // onClick={() => handleOpenModal('delete', item)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">No UPCs found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Custom Pagination Component */}
                    {!loading && pagination.totalPages > 0 && (
                        <CustomPagination
                            pageCount={pagination.totalPages}
                            onPageChange={handlePageChange}
                            currentPage={pagination.currentPage}
                            perPage={pagination.limit}
                            onPerPageChange={handlePerPageChange}
                        />
                    )}
                </div>
            </section>

            {/* Bulk Add UPC Modal (Upload) */}
            {modalType === 'upload' && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Bulk Add UPC</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={handleUploadSubmit}>
                                <div className="modal-body">
                                    <p className="small text-muted mb-3">
                                        Please upload an Excel file (.xlsx or .xls) containing columns <strong>UPC</strong> and <strong>EAN</strong>.
                                    </p>
                                    <div className="mb-3">
                                        <label className="form-label required">Select Excel File</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            accept=".xlsx, .xls, .csv"
                                            onChange={handleFileChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                    <button type="submit" className="btn bgGreen clWhite" disabled={isUploading || !selectedFile}>
                                        {isUploading ? 'Uploading...' : 'Upload File'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit UPC Modal */}
            {modalType === 'edit' && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit UPC</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label required">UPC Code</label>
                                        <input
                                            type="text"
                                            className={`form-control ${formik.touched.upc && formik.errors.upc ? 'is-invalid' : ''}`}
                                            name="upc"
                                            value={formik.values.upc}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter UPC code"
                                        />
                                        {formik.touched.upc && formik.errors.upc && (
                                            <small className="text-danger">{formik.errors.upc}</small>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label required">EAN Code</label>
                                        <input
                                            type="text"
                                            className={`form-control ${formik.touched.ean && formik.errors.ean ? 'is-invalid' : ''}`}
                                            name="ean"
                                            value={formik.values.ean}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter EAN code"
                                        />
                                        {formik.touched.ean && formik.errors.ean && (
                                            <small className="text-danger">{formik.errors.ean}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                    <button type="submit" className="btn bgGreen clWhite" disabled={formik.isSubmitting}>
                                        {formik.isSubmitting ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {modalType === 'delete' && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete the UPC <strong>{selectedUPC?.upc}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete UPC'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ManageUPCComponent;
