import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";

function ManageSubGenreComponent() {
    const [subGenres, setSubGenres] = useState([]);
    const [genres, setGenres] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalType, setModalType] = useState(null); // 'add', 'edit', 'delete'
    const [selectedSubGenre, setSelectedSubGenre] = useState(null);
    const [pagination, setPagination] = useState({
        totalDocs: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });

    const validationSchema = Yup.object({
        title: Yup.string().trim().required("Sub-genre title is required"),
        genre_id: Yup.string().required("Parent genre is required"),
        description: Yup.string(),
    });

    const formik = useFormik({
        initialValues: {
            title: selectedSubGenre?.title || '',
            genre_id: selectedSubGenre?.genre_id || '',
            description: selectedSubGenre?.description || '',
            status: selectedSubGenre?.status ?? 1
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const endpoint = modalType === 'add' ? "/create-subgenre" : `/update-subgenre/${selectedSubGenre.id || selectedSubGenre._id}`;
            const method = modalType === 'add' ? "POST" : "PUT";

            try {
                const response = await apiRequest(endpoint, method, values, true);
                if (response.success) {
                    toast.success(`Sub-genre ${modalType === 'add' ? 'created' : 'updated'} successfully`);
                    handleCloseModal();
                    fetchSubGenres();
                } else {
                    toast.error(response?.data?.message || `Failed to ${modalType} sub-genre`);
                }
            } catch (error) {
                console.error(`${modalType} sub-genre error:`, error);
                toast.error(`An error occurred while ${modalType === 'add' ? 'creating' : 'updating'} sub-genre`);
            }
        },
    });

    useEffect(() => {
        fetchSubGenres(pagination.currentPage);
    }, [pagination.currentPage]);

    useEffect(() => {
        fetchGenres();
    }, []);

    const fetchSubGenres = async (page = 1, currentLimit = pagination.limit) => {
        setLoading(true);
        try {
            const response = await apiRequest(`/subgenres?page=${page}&limit=${currentLimit}`, "GET", null, true);
            if (response.success) {
                setSubGenres(response?.data?.data || []);
                if (response?.data?.pagination) {
                    setPagination(response.data.pagination);
                }
            } else {
                toast.error("Failed to fetch sub-genres");
            }
        } catch (error) {
            console.error("Fetch sub-genres error:", error);
            toast.error("An error occurred while fetching sub-genres");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handlePerPageChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
        fetchSubGenres(1, newLimit);
    };

    const fetchGenres = async () => {
        try {
            const response = await apiRequest("/genres?limit=1000", "GET", null, true);
            if (response.success) {
                setGenres(response?.data?.data || []);
            }
        } catch (error) {
            console.error("Fetch genres error:", error);
        }
    };

    const handleOpenModal = (type, subGenre = null) => {
        setModalType(type);
        setSelectedSubGenre(subGenre);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedSubGenre(null);
        formik.resetForm();
    };

    const handleDelete = async () => {
        if (!selectedSubGenre) return;
        try {
            const response = await apiRequest(`/delete-subgenre/${selectedSubGenre.id || selectedSubGenre._id}`, "DELETE", null, true);
            if (response.success) {
                toast.success("Sub-genre deleted successfully");
                handleCloseModal();
                fetchSubGenres();
            } else {
                toast.error(response?.data?.message || "Failed to delete sub-genre");
            }
        } catch (error) {
            console.error("Delete sub-genre error:", error);
            toast.error("An error occurred while deleting the sub-genre");
        }
    };

    const handleToggleStatus = async (subGenre) => {
        const newStatus = subGenre.status === 1 ? 0 : 1;
        try {
            const response = await apiRequest(`/update-subgenre/${subGenre.id || subGenre._id}`, "PUT", { status: newStatus }, true);
            if (response.success) {
                toast.success(`Sub-genre status updated successfully`);
                fetchSubGenres();
            } else {
                toast.error(response?.data?.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Toggle status error:", error);
            toast.error("An error occurred while updating status");
        }
    };

    const getGenreTitle = (genreId) => {
        const genre = genres.find(g => g.id === genreId || g._id === genreId);
        return genre ? genre.title : `ID: ${genreId}`;
    };

    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="Audio-main-sec">
                    <div className="view-release">
                        <div className="view-release-heading">
                            <h6>Manage Sub Genre</h6>
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
                            <Loader message="Fetching sub-genres..." variant="success" />
                        ) : (
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>Sub Genre Name</th>
                                        <th>Genre Name</th>
                                        <th>Sub Genre Description</th>
                                        <th>Sub Genre Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {subGenres.length > 0 ? (
                                        subGenres.map((subGenre, index) => (
                                            <tr key={subGenre.id || subGenre._id}>
                                                <td>{((pagination.currentPage - 1) * pagination.limit) + index + 1}</td>
                                                <td>{subGenre.title}</td>
                                                <td>{getGenreTitle(subGenre.genre_id)}</td>
                                                <td className="news-pra">
                                                    <p>{subGenre.description || 'No description'}</p>
                                                </td>
                                                <td className="genreStatus">
                                                    <div className="form-check form-switch">
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            checked={subGenre.status === 1}
                                                            onChange={() => handleToggleStatus(subGenre)}
                                                        />
                                                        <label className="form-check-label">
                                                            {subGenre.status === 1 ? 'Enabled' : 'Disabled'}
                                                        </label>
                                                    </div>
                                                </td>
                                                <td className="excel-button view-subLabels-btn manageGenre" id="subLabelsBtn">
                                                    <div className="manage-gen-btnBox">
                                                        <button
                                                            type="button"
                                                            className="btn excel"
                                                            id="subLabelsBtn"
                                                            onClick={() => handleOpenModal('edit', subGenre)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn excel"
                                                            id="subLabelsDel"
                                                            onClick={() => handleOpenModal('delete', subGenre)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="text-center">No sub-genres found</td>
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
                                <h5 className="modal-title">{modalType === 'add' ? 'Add New Sub-genre' : 'Edit Sub-genre'}</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <form onSubmit={formik.handleSubmit}>
                                <div className="modal-body">
                                    <div className="mb-3">
                                        <label className="form-label required">Sub Genre Title</label>
                                        <input
                                            type="text"
                                            className={`form-control ${formik.touched.title && formik.errors.title ? 'is-invalid' : ''}`}
                                            name="title"
                                            value={formik.values.title}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            placeholder="Enter sub-genre title"
                                        />
                                        {formik.touched.title && formik.errors.title && (
                                            <small className="text-danger">{formik.errors.title}</small>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label required">Select Parent Genre</label>
                                        <select
                                            className={`form-select ${formik.touched.genre_id && formik.errors.genre_id ? 'is-invalid' : ''}`}
                                            name="genre_id"
                                            value={formik.values.genre_id}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        >
                                            <option value="">-- Choose Genre --</option>
                                            {genres.map(genre => (
                                                <option key={genre.id || genre._id} value={genre.id || genre._id}>
                                                    {genre.title}
                                                </option>
                                            ))}
                                        </select>
                                        {formik.touched.genre_id && formik.errors.genre_id && (
                                            <small className="text-danger">{formik.errors.genre_id}</small>
                                        )}
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Sub Genre Description</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            value={formik.values.description}
                                            onChange={formik.handleChange}
                                            placeholder="Enter sub-genre description"
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
                                <p>Are you sure you want to delete the sub-genre <strong>{selectedSubGenre?.title}</strong>? This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                >
                                    Delete Sub-genre
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ManageSubGenreComponent;
