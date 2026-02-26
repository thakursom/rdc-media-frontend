import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";

function ManageCountryComponent() {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalType, setModalType] = useState(null); // 'add' or 'edit' or 'delete'
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [pagination, setPagination] = useState({
        totalDocs: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });

    const validationSchema = Yup.object({
        countryName: Yup.string().trim().required("Country Name is required"),
        countryCode: Yup.string().trim().required("Country Code is required"),
    });

    const formik = useFormik({
        initialValues: {
            countryName: selectedCountry?.countryName || '',
            countryCode: selectedCountry?.countryCode || '',
            status: selectedCountry?.status !== undefined ? selectedCountry.status : true
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const endpoint = modalType === 'add' ? "/create-country" : `/update-country/${selectedCountry.id || selectedCountry._id}`;
            const method = modalType === 'add' ? "POST" : "PUT";

            try {
                const response = await apiRequest(endpoint, method, values, true);
                if (response.success) {
                    toast.success(`Country ${modalType === 'add' ? 'created' : 'updated'} successfully`);
                    handleCloseModal();
                    fetchCountries();
                } else {
                    toast.error(response?.data?.message || `Failed to ${modalType} country`);
                }
            } catch (error) {
                console.error(`${modalType} country error:`, error);
                toast.error(`An error occurred while ${modalType === 'add' ? 'creating' : 'updating'} country`);
            }
        },
    });

    const fetchCountries = async (page = 1, currentLimit = pagination.limit) => {
        setLoading(true);
        try {
            const response = await apiRequest(`/countries?page=${page}&limit=${currentLimit}`, "GET", null, true);
            if (response.success) {
                setCountries(response?.data?.data || []);
                if (response?.data?.pagination) {
                    setPagination(response.data.pagination);
                }
            } else {
                toast.error(response?.data?.message || "Failed to fetch countries");
            }
        } catch (error) {
            console.error("Fetch countries error:", error);
            toast.error("An error occurred while fetching countries");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handlePerPageChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
        fetchCountries(1, newLimit);
    };

    useEffect(() => {
        fetchCountries(pagination.currentPage);
    }, [pagination.currentPage]);

    const handleOpenModal = (type, country = null) => {
        setModalType(type);
        setSelectedCountry(country);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedCountry(null);
        formik.resetForm();
    };

    const handleDelete = async () => {
        if (!selectedCountry) return;
        setIsDeleting(true);
        try {
            const response = await apiRequest(`/delete-country/${selectedCountry.id || selectedCountry._id}`, "DELETE", null, true);
            if (response.success) {
                toast.success("Country deleted successfully");
                handleCloseModal();
                fetchCountries();
            } else {
                toast.error(response?.data?.message || "Failed to delete country");
            }
        } catch (error) {
            console.error("Delete country error:", error);
            toast.error("An error occurred while deleting the country");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggleStatus = async (country) => {
        const newStatus = !country.status;
        try {
            const response = await apiRequest(`/update-country/${country.id || country._id}`, "PUT", { status: newStatus }, true);
            if (response.success) {
                toast.success(`Country status updated to ${newStatus ? 'Enabled' : 'Disabled'}`);
                fetchCountries();
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
                            <h6>Manage Countries</h6>
                        </div>
                        <div className="manage-genre-btn">
                            <button
                                type="button"
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
                            <Loader message="Fetching countries..." variant="success" />
                        ) : (
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>Country Name</th>
                                        <th>Country Code</th>
                                        <th>Country Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {countries.length > 0 ? (
                                        countries.map((country, index) => (
                                            <tr key={country.id || country._id}>
                                                <td>{((pagination.currentPage - 1) * pagination.limit) + index + 1}</td>
                                                <td>{country.countryName}</td>
                                                <td>{country.countryCode}</td>
                                                <td className="genreStatus">
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={country.status}
                                                            onChange={() => handleToggleStatus(country)}
                                                            id={`status-${country.id || country._id}`}
                                                        />
                                                        <label className="form-check-label" htmlFor={`status-${country.id || country._id}`}>
                                                            {country.status ? "Enabled" : "Disabled"}
                                                        </label>
                                                    </div>
                                                </td>
                                                <td className="excel-button view-subLabels-btn manageGenre" id="subLabelsBtn">
                                                    <div className="manage-gen-btnBox">
                                                        <button
                                                            type="button"
                                                            className="btn excel"
                                                            id="subLabelsBtn"
                                                            onClick={() => handleOpenModal('edit', country)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn excel"
                                                            id="subLabelsDel"
                                                            onClick={() => handleOpenModal('delete', country)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">No countries found</td>
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

            {/* Add/Edit Modal */}
            {(modalType === 'add' || modalType === 'edit') && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">{modalType === 'add' ? 'Add New Country' : 'Edit Country'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label required">Country Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${formik.touched.countryName && formik.errors.countryName ? 'is-invalid' : ''}`}
                                            name="countryName"
                                            value={formik.values.countryName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter country name"
                                        />
                                        {formik.touched.countryName && formik.errors.countryName && (
                                            <small className="text-danger">{formik.errors.countryName}</small>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label required">Country Code</label>
                                        <input
                                            type="text"
                                            className={`form-control ${formik.touched.countryCode && formik.errors.countryCode ? 'is-invalid' : ''}`}
                                            name="countryCode"
                                            value={formik.values.countryCode}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter country code (e.g., IN, US)"
                                        />
                                        {formik.touched.countryCode && formik.errors.countryCode && (
                                            <small className="text-danger">{formik.errors.countryCode}</small>
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
                                <p>Are you sure you want to delete the country <strong>{selectedCountry?.countryName}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Country'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ManageCountryComponent;
