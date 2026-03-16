import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import CustomPagination from "../Pagination/CustomPagination";

function ViewTicketComponent() {
    const navigate = useNavigate();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [pagination, setPagination] = useState({
        totalDocs: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });

    // For Delete Confirmation
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const fetchTickets = async (page = 1, search = "", currentLimit = pagination.limit) => {
        try {
            setLoading(true);
            const response = await apiRequest(`/tickets?page=${page}&limit=${currentLimit}&search=${encodeURIComponent(search)}`, "GET", null, true);

            if (response.success && response.data && response.data.data && response.data.data.tickets) {
                setTickets(response.data.data.tickets);
                if (response.data.data.pagination) {
                    setPagination(response.data.data.pagination);
                }
            } else if (response.success && response.data && response.data.tickets) {
                setTickets(response.data.tickets);
                if (response.data.pagination) {
                    setPagination(response.data.pagination);
                }
            } else {
                toast.error("Failed to fetch tickets.");
            }
        } catch (error) {
            console.error("Fetch tickets error:", error);
            toast.error("An error occurred while fetching tickets.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets(pagination.currentPage, searchTerm);
    }, [pagination.currentPage]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        fetchTickets(1, searchTerm);
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handlePerPageChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
        fetchTickets(1, searchTerm, newLimit);
    };

    const openDeleteModal = (ticket) => {
        setSelectedTicket(ticket);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setSelectedTicket(null);
        setShowDeleteModal(false);
    };

    const handleDelete = async () => {
        if (!selectedTicket) return;
        setIsDeleting(true);
        try {
            const response = await apiRequest(`/delete-ticket/${selectedTicket._id}`, "DELETE", null, true);
            if (response.success) {
                toast.success("Ticket deleted successfully.");
                closeDeleteModal();
                fetchTickets(pagination.currentPage, searchTerm);
            } else {
                toast.error(response?.data?.message || "Failed to delete ticket.");
            }
        } catch (error) {
            console.error("Delete ticket error:", error);
            toast.error("An error occurred while deleting ticket.");
        } finally {
            setIsDeleting(false);
        }
    };



    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="view-release-sec scroll-x-hidden">
                    <div className="view-release">
                        <div className="view-release-heading">
                            <h6 className='clPurple'>Tickets</h6>
                        </div>
                        <div className="manage-genre-btn d-flex align-items-center">
                            <form className="me-3 d-flex" onSubmit={handleSearch}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search ticket..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setSearchTerm(val);
                                            if (val === '') {
                                                setPagination(prev => ({ ...prev, currentPage: 1 }));
                                                fetchTickets(1, '');
                                            }
                                        }}
                                    />
                                    <button className="btn bgPurple clWhite" type="submit">
                                        <i className="fa-solid fa-magnifying-glass" />
                                    </button>
                                </div>
                            </form>
                            <button
                                type="button"
                                className="mainBtn bgPurple clWhite"
                                onClick={() => navigate('/add-ticket')}
                            >
                                <i className="fa-solid fa-plus" />
                                Add New
                            </button>
                        </div>
                    </div>

                    <div className="viewReleases-main-sec audio-sec mt-3">
                        {loading ? (
                            <Loader message="Fetching tickets..." variant="success" />
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered text-center align-middle">
                                    <thead>
                                        <tr>
                                            <th>SN</th>
                                            <th>Name</th>
                                            <th>Subject</th>
                                            <th>Department</th>
                                            <th>Priority</th>
                                            <th>Close Date</th>
                                            <th>Replied By</th>
                                            <th>Active ticket</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tickets.length > 0 ? (
                                            tickets.map((ticket, index) => (
                                                <tr key={ticket._id}>
                                                    <td>{((pagination.currentPage - 1) * pagination.limit) + index + 1}</td>
                                                    <td><h6 className="mb-0 text-dark">{ticket.name}</h6></td>
                                                    <td><p className="mb-0 text-truncate mx-auto text-dark" style={{ maxWidth: '150px' }}>{ticket.subject}</p></td>
                                                    <td className="text-dark">{ticket.department}</td>
                                                    <td className="text-dark">{ticket.priority}</td>
                                                    <td className="text-dark">
                                                        {ticket.closeDate ? new Date(ticket.closeDate).toLocaleDateString() : '-'}
                                                    </td>
                                                    <td className="text-dark">{ticket.repliedBy || '-'}</td>
                                                    <td>
                                                        <span className={`badge ${ticket.activeTicket ? 'bg-success' : 'bg-secondary'}`}>
                                                            {ticket.activeTicket ? 'Yes' : 'No'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${ticket.status === 'Open' ? 'bg-primary' :
                                                            ticket.status === 'In Progress' ? 'bg-warning text-dark' :
                                                                ticket.status === 'Resolved' ? 'bg-success' : 'bg-secondary'
                                                            }`}>
                                                            {ticket.status}
                                                        </span>
                                                    </td>
                                                    <td className="view-artist-button">
                                                        <button
                                                            type="button"
                                                            className="mainBtn bgPurple clWhite"
                                                            onClick={() => navigate(`/add-ticket/${ticket._id}`)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="mainBtn bgRed clWhite"
                                                            onClick={() => openDeleteModal(ticket)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="10" className="text-center py-4 text-muted">
                                                    No tickets found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

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
            {showDeleteModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={closeDeleteModal}><i class="fa-solid fa-xmark"></i></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete the ticket from <strong>{selectedTicket?.name}</strong>? This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="mainBtn bgGray clWhite" onClick={closeDeleteModal}>Cancel</button>
                                <button
                                    type="button"
                                    className="mainBtn bgRed clWhite"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Ticket'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ViewTicketComponent;
