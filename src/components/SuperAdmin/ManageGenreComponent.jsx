import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";

function ManageGenreComponent() {
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalType, setModalType] = useState(null); // 'add' or 'edit' or 'delete'
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [pagination, setPagination] = useState({
        totalDocs: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });

    const validationSchema = Yup.object({
        title: Yup.string().trim().required("Genre title is required"),
        description: Yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            title: selectedGenre?.title || '',
            description: selectedGenre?.description || '',
            status: selectedGenre?.status !== undefined ? selectedGenre.status : true
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const endpoint = modalType === 'add' ? "/create-genre" : `/update-genre/${selectedGenre.id || selectedGenre._id}`;
            const method = modalType === 'add' ? "POST" : "PUT";

            try {
                const response = await apiRequest(endpoint, method, values, true);
                if (response.success) {
                    toast.success(`Genre ${modalType === 'add' ? 'created' : 'updated'} successfully`);
                    handleCloseModal();
                    fetchGenres();
                } else {
                    toast.error(response?.data?.message || `Failed to ${modalType} genre`);
                }
            } catch (error) {
                console.error(`${modalType} genre error:`, error);
                toast.error(`An error occurred while ${modalType === 'add' ? 'creating' : 'updating'} genre`);
            }
        },
    });

    const fetchGenres = async (page = 1, currentLimit = pagination.limit) => {
        setLoading(true);
        try {
            const response = await apiRequest(`/genres?page=${page}&limit=${currentLimit}`, "GET", null, true);
            if (response.success) {
                setGenres(response?.data?.data || []);
                if (response?.data?.pagination) {
                    setPagination(response.data.pagination);
                }
            } else {
                toast.error(response?.data?.message || "Failed to fetch genres");
            }
        } catch (error) {
            console.error("Fetch genres error:", error);
            toast.error("An error occurred while fetching genres");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handlePerPageChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
        fetchGenres(1, newLimit);
    };

    useEffect(() => {
        fetchGenres(pagination.currentPage);
    }, [pagination.currentPage]);

    const handleOpenModal = (type, genre = null) => {
        setModalType(type);
        setSelectedGenre(genre);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedGenre(null);
        formik.resetForm();
    };

    const handleDelete = async () => {
        if (!selectedGenre) return;
        setIsDeleting(true);
        try {
            const response = await apiRequest(`/delete-genre/${selectedGenre.id || selectedGenre._id}`, "DELETE", null, true);
            if (response.success) {
                toast.success("Genre deleted successfully");
                handleCloseModal();
                fetchGenres();
            } else {
                toast.error(response?.data?.message || "Failed to delete genre");
            }
        } catch (error) {
            console.error("Delete genre error:", error);
            toast.error("An error occurred while deleting the genre");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleToggleStatus = async (genre) => {
        const newStatus = !genre.status;
        try {
            const response = await apiRequest(`/update-genre/${genre.id || genre._id}`, "PUT", { status: newStatus }, true);
            if (response.success) {
                toast.success(`Genre status updated to ${newStatus ? 'Enabled' : 'Disabled'}`);
                fetchGenres();
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
                            <h6>Manage Genre</h6>
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
                            <Loader message="Fetching genres..." variant="success" />
                        ) : (
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>Genre Name</th>
                                        <th>Genre Description</th>
                                        <th>Genre Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {genres.length > 0 ? (
                                        genres.map((genre, index) => (
                                            <tr key={genre.id || genre._id}>
                                                <td>{((pagination.currentPage - 1) * pagination.limit) + index + 1}</td>
                                                <td>{genre.title}</td>
                                                <td className="news-pra">
                                                    <p>{genre.description || "No description provided"}</p>
                                                </td>
                                                <td className="genreStatus">
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={genre.status}
                                                            onChange={() => handleToggleStatus(genre)}
                                                            id={`status-${genre.id || genre._id}`}
                                                        />
                                                        <label className="form-check-label" htmlFor={`status-${genre.id || genre._id}`}>
                                                            {genre.status ? "Enabled" : "Disabled"}
                                                        </label>
                                                    </div>
                                                </td>
                                                <td className="excel-button view-subLabels-btn manageGenre" id="subLabelsBtn">
                                                    <div className="manage-gen-btnBox">
                                                        <button
                                                            type="button"
                                                            className="btn excel"
                                                            id="subLabelsBtn"
                                                            onClick={() => handleOpenModal('edit', genre)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn excel"
                                                            id="subLabelsDel"
                                                            onClick={() => handleOpenModal('delete', genre)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">No genres found</td>
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
                                <h5 className="modal-title">{modalType === 'add' ? 'Add New Genre' : 'Edit Genre'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label required">Genre Title</label>
                                        <input
                                            type="text"
                                            className={`form-control ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
                                            name="title"
                                            value={formik.values.title}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter genre title"
                                        />
                                        {formik.touched.title && formik.errors.title && (
                                            <small className="text-danger">{formik.errors.title}</small>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Genre Description</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            placeholder="Enter genre description"
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
                                <p>Are you sure you want to delete the genre <strong>{selectedGenre?.title}</strong>? This will also delete all associated subgenres.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Genre'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ManageGenreComponent;
