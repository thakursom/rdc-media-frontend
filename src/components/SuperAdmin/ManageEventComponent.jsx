import React, { useState, useEffect } from 'react';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";
import { useNavigate } from 'react-router-dom';

function ManageEventComponent() {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
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

    const fetchEvents = async (page = 1, currentLimit = pagination.limit, search = appliedSearch, status = appliedStatus) => {
        setLoading(true);
        try {
            let endpoint = `/events?page=${page}&limit=${currentLimit}`;
            if (search) endpoint += `&search=${encodeURIComponent(search)}`;
            if (status !== "All") endpoint += `&status=${status}`;

            const response = await apiRequest(endpoint, "GET", null, true);
            if (response.success) {
                setEvents(response?.data?.data || []);
                if (response?.data?.pagination) {
                    setPagination(response.data.pagination);
                }
            } else {
                toast.error(response?.message || "Failed to fetch events");
            }
        } catch (error) {
            console.error("Fetch events error:", error);
            toast.error("An error occurred while fetching events");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents(pagination.currentPage, pagination.limit, appliedSearch, appliedStatus);
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

    const openDeleteModal = (event) => {
        setSelectedEvent(event);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setSelectedEvent(null);
        setShowDeleteModal(false);
    };

    const handleDelete = async () => {
        if (!selectedEvent) return;
        setIsDeleting(true);
        try {
            const response = await apiRequest(`/delete-event/${selectedEvent._id}`, "DELETE", null, true);
            if (response.success) {
                toast.success("Event deleted successfully");
                closeDeleteModal();
                fetchEvents(pagination.currentPage);
            } else {
                toast.error(response?.message || "Failed to delete event");
            }
        } catch (error) {
            toast.error("An error occurred while deleting the event");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <section className="right-sidebar" id="sidebarRight">
            <div className="Audio-main-sec">
                <div className="view-release" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                    <div className="view-release-heading my-0">
                        <h6 className='clPurple'>Manage Events</h6>
                    </div>

                    <div className="d-flex align-items-center flex-wrap gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search Events"
                            style={{ width: '250px' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        <select
                            className="form-select"
                            style={{ width: '120px' }}
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value);
                                setAppliedStatus(e.target.value);
                                setPagination(prev => ({ ...prev, currentPage: 1 }));
                            }}
                        >
                            <option value="All">All Status</option>
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                        </select>

                        <button type="button" className="mainBtn bgPurple clWhite" onClick={handleSearch}>
                            Search
                        </button>
                        <button type="button" className="mainBtn bgGray clWhite" onClick={handleReset}>
                            Reset
                        </button>

                        <button
                            type="button"
                            className="mainBtn bgPurple clWhite"
                            onClick={() => navigate('/add-event')}
                        >
                            + Add Event
                        </button>
                    </div>
                </div>

                <div className="viewReleases-main-sec audio-sec mt-3">
                    {loading ? (
                        <Loader message="Fetching Events..." variant="success" />
                    ) : (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Event Date</th>
                                    <th>Status</th>
                                    <th>Description</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.length > 0 ? (
                                    events.map((item) => (
                                        <tr key={item._id}>
                                            <td>{item.title}</td>
                                            <td>{new Date(item.eventDate).toLocaleDateString()}</td>
                                            <td>
                                                <span className={`badge ${item.status === 'Active' ? 'bg-success' : 'bg-danger'}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {item.description || '—'}
                                            </td>
                                            <td>
                                                <div className="manage-gen-btnBox d-flex gap-2">
                                                    <button
                                                        type="button"
                                                        className="mainBtn bgPurple clWhite"
                                                        onClick={() => navigate(`/edit-event/${item._id}`)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="mainBtn bgRed clWhite"
                                                        onClick={() => openDeleteModal(item)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center py-5">
                                            <div className="mb-2">
                                                <i className="fa-regular fa-calendar-xmark fa-3x text-muted"></i>
                                            </div>
                                            No events found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {!loading && pagination.totalPages > 1 && (
                    <CustomPagination
                        pageCount={pagination.totalPages}
                        onPageChange={handlePageChange}
                        currentPage={pagination.currentPage}
                        perPage={pagination.limit}
                    />
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            <div className="modal-header bg-light">
                                <h5 className="modal-title clPurple">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={closeDeleteModal}><i className="fa-solid fa-xmark"></i></button>
                            </div>
                            <div className="modal-body p-4 text-center">
                                <div className="mb-3">
                                    <i className="fa-solid fa-triangle-exclamation fa-3x text-warning"></i>
                                </div>
                                <p className="mb-0">Are you sure you want to delete the event <strong>{selectedEvent?.title}</strong>?</p>
                                <small className="text-muted">This action cannot be undone.</small>
                            </div>
                            <div className="modal-footer bg-light border-0">
                                <button type="button" className="mainBtn bgGray clWhite" onClick={closeDeleteModal}>Cancel</button>
                                <button
                                    type="button"
                                    className="mainBtn bgRed clWhite"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <>
                                            <i className="fa-solid fa-spinner fa-spin me-2"></i>Deleting...
                                        </>
                                    ) : (
                                        'Delete Event'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}

export default ManageEventComponent;
