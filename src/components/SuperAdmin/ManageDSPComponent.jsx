import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";

function ManageDSPComponent() {
    const [dsps, setDsps] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalType, setModalType] = useState(null); // 'add', 'edit', 'delete'
    const [selectedDsp, setSelectedDsp] = useState(null);
    const [pagination, setPagination] = useState({
        totalDocs: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });

    const validationSchema = Yup.object({
        name: Yup.string().trim().required("DSP name is required"),
        description: Yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            description: '',
            status: 1
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const endpoint = modalType === 'add' ? "/create-dsp" : `/update-dsp/${selectedDsp.id || selectedDsp._id}`;
            const method = modalType === 'add' ? "POST" : "PUT";

            try {
                const response = await apiRequest(endpoint, method, values, true);
                if (response.success) {
                    toast.success(`DSP ${modalType === 'add' ? 'created' : 'updated'} successfully`);
                    handleCloseModal();
                    fetchDsps();
                } else {
                    toast.error(response?.data?.message || `Failed to ${modalType} DSP`);
                }
            } catch (error) {
                console.error(`${modalType} DSP error:`, error);
                toast.error(`An error occurred while ${modalType === 'add' ? 'creating' : 'updating'} DSP`);
            }
        },
    });

    useEffect(() => {
        fetchDsps(pagination.currentPage);
    }, [pagination.currentPage]);

    const fetchDsps = async (page = 1, currentLimit = pagination.limit) => {
        setLoading(true);
        try {
            const response = await apiRequest(`/dsps?page=${page}&limit=${currentLimit}`, "GET", null, true);
            if (response.success) {
                setDsps(response?.data?.data || []);
                if (response?.data?.pagination) {
                    setPagination(response.data.pagination);
                }
            } else {
                toast.error(response?.data?.message || "Failed to fetch DSPs");
            }
        } catch (error) {
            console.error("Fetch DSPs error:", error);
            toast.error("An error occurred while fetching DSPs");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handlePerPageChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
        fetchDsps(1, newLimit);
    };

    const handleOpenModal = (type, dsp = null) => {
        setModalType(type);
        if (dsp) {
            setSelectedDsp(dsp);
            if (type !== 'delete') {
                formik.resetForm({
                    values: {
                        name: dsp.name || '',
                        description: dsp.description || '',
                        status: dsp.status ?? 1
                    }
                });
            }
        } else {
            setSelectedDsp(null);
            formik.resetForm({
                values: {
                    name: '',
                    description: '',
                    status: 1
                }
            });
        }
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedDsp(null);
        formik.resetForm();
    };

    const handleDelete = async () => {
        if (!selectedDsp) return;
        try {
            const response = await apiRequest(`/delete-dsp/${selectedDsp.id || selectedDsp._id}`, "DELETE", null, true);
            if (response.success) {
                toast.success("DSP deleted successfully");
                handleCloseModal();
                fetchDsps();
            } else {
                toast.error(response?.data?.message || "Failed to delete DSP");
            }
        } catch (error) {
            console.error("Delete DSP error:", error);
            toast.error("An error occurred while deleting the DSP");
        }
    };

    const handleToggleStatus = async (dsp) => {
        const newStatus = dsp.status === 1 ? 0 : 1;
        try {
            const response = await apiRequest(`/update-dsp/${dsp.id || dsp._id}`, "PUT", { status: newStatus }, true);
            if (response.success) {
                toast.success(`DSP status updated successfully`);
                fetchDsps();
            } else {
                toast.error(response?.data?.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Toggle status error:", error);
            toast.error("An error occurred while updating status");
        }
    };

    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="Audio-main-sec">
                    <div className="view-release">
                        <div className="view-release-heading">
                            <h6>Manage DSPs</h6>
                        </div>
                        <div className="manage-genre-btn">
                            <button
                                className="btn mangageGenre"
                                onClick={() => handleOpenModal('add')}
                            >
                                <i className="fa-solid fa-plus" />
                                Add New
                            </button>
                        </div>
                    </div>
                    <div className="viewReleases-main-sec audio-sec">
                        {loading ? (
                            <Loader message="Fetching DSPs..." variant="success" />
                        ) : (
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>DSP Name</th>
                                        <th>Description</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dsps.length > 0 ? (
                                        dsps.map((dsp, index) => (
                                            <tr key={dsp.id || dsp._id}>
                                                <td>{((pagination.currentPage - 1) * pagination.limit) + index + 1}</td>
                                                <td>{dsp.name}</td>
                                                <td className="news-pra">
                                                    <p>{dsp.description || 'No description'}</p>
                                                </td>
                                                <td className="genreStatus">
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={dsp.status === 1}
                                                            onChange={() => handleToggleStatus(dsp)}
                                                        />
                                                        <label className="form-check-label">
                                                            {dsp.status === 1 ? 'Enabled' : 'Disabled'}
                                                        </label>
                                                    </div>
                                                </td>
                                                <td className="excel-button view-subLabels-btn manageGenre" id="subLabelsBtn">
                                                    <div className="manage-gen-btnBox">
                                                        <button
                                                            className="btn excel"
                                                            id="subLabelsBtn"
                                                            onClick={() => handleOpenModal('edit', dsp)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            className="btn excel"
                                                            id="subLabelsDel"
                                                            onClick={() => handleOpenModal('delete', dsp)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">No DSPs found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Custom Pagination */}
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

            {/* Add/Edit Modal */}
            {(modalType === 'add' || modalType === 'edit') && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{modalType === 'add' ? 'Add New DSP' : 'Edit DSP'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label required">DSP Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                                            name="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter DSP name"
                                        />
                                        {formik.touched.name && formik.errors.name && (
                                            <small className="text-danger">{formik.errors.name}</small>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Description</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            placeholder="Enter DSP description"
                                            rows="3"
                                        ></textarea>
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
                                <p>Are you sure you want to delete the DSP <strong>{selectedDsp?.name}</strong>? This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                >
                                    Delete DSP
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ManageDSPComponent;
