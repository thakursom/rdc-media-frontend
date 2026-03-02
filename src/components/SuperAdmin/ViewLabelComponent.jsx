import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import CustomPagination from "../Pagination/CustomPagination";

function ViewLabelComponent() {
    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [labelToDelete, setLabelToDelete] = useState(null);
    const [pagination, setPagination] = useState({
        totalDocs: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });
    const navigate = useNavigate();

    const fetchLabels = async (page = 1, currentLimit = pagination.limit) => {
        setLoading(true);
        try {
            const response = await apiRequest(`/all-labels?page=${page}&limit=${currentLimit}`, "GET", null, true);
            if (response.success && response.data?.data) {
                setLabels(response.data.data);
                if (response.data.pagination) {
                    setPagination(response.data.pagination);
                }
            } else {
                toast.error(response?.data?.message || "Failed to fetch labels");
            }
        } catch (error) {
            console.error("Fetch labels error:", error);
            toast.error("An error occurred while fetching labels");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handlePerPageChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
        fetchLabels(1, newLimit);
    };

    useEffect(() => {
        fetchLabels(pagination.currentPage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pagination.currentPage]);

    const handleEdit = (id) => {
        navigate(`/add-label?id=${id}`);
    };

    const confirmDelete = (label) => {
        setLabelToDelete(label);
    };

    const handleDelete = async () => {
        if (!labelToDelete) return;
        setIsDeleting(true);
        try {
            const response = await apiRequest(`/delete-label/${labelToDelete.id || labelToDelete._id}`, "DELETE", null, true);
            if (response.success) {
                toast.success("Label deleted successfully");
                setLabelToDelete(null);
                fetchLabels(pagination.currentPage);
            } else {
                toast.error(response?.data?.message || "Failed to delete label");
            }
        } catch (error) {
            console.error("Delete label error:", error);
            toast.error("An error occurred while deleting the label");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="Audio-main-sec">
                    <div className="view-release">
                        <div className="view-release-heading">
                            <h6>View Labels</h6>
                        </div>
                        <div className="manage-genre-btn">
                            <button
                                type="button"
                                className="btn mangageGenre"
                                onClick={() => navigate('/add-label')}
                            >
                                <i className="fa-solid fa-plus" />
                                Add New
                            </button>
                        </div>
                    </div>
                    <div className="viewReleases-main-sec audio-sec">
                        {loading ? (
                            <Loader message="Fetching labels..." variant="success" />
                        ) : (
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Country</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {labels.length > 0 ? (
                                        labels.map((label, index) => (
                                            <tr key={label.id || label._id || index}>
                                                <td>{((pagination.currentPage - 1) * pagination.limit) + index + 1}</td>
                                                <td id="artist-td">{label.name}</td>
                                                <td>{label.email}</td>
                                                <td>{label.country}</td>
                                                <td className="excel-button view-subLabels-btn manageGenre" id="subLabelsBtn">
                                                    <div className="manage-gen-btnBox">
                                                        <button
                                                            type="button"
                                                            className="btn excel"
                                                            id="subLabelsBtn"
                                                            onClick={() => handleEdit(label.id || label._id)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn excel"
                                                            id="subLabelsDel"
                                                            onClick={() => confirmDelete(label)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="text-center">No labels found</td>
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

            {/* Delete Confirmation Modal */}
            {labelToDelete && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={() => setLabelToDelete(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete the label <strong>{labelToDelete.name}</strong>?</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setLabelToDelete(null)}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Label'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default ViewLabelComponent;
