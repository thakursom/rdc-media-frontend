import React, { useState, useEffect } from 'react';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";
import { Link, useNavigate } from "react-router-dom";

function SavedReleaseComponent() {
    const navigate = useNavigate();
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        totalDocs: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });
    const [expandedReleases, setExpandedReleases] = useState([]);
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [availableEvents, setAvailableEvents] = useState([]);
    const [selectedEventIds, setSelectedEventIds] = useState([]);
    const [submittingAssignment, setSubmittingAssignment] = useState(false);

    const toggleReleaseTracks = (id) => {
        setExpandedReleases(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

    useEffect(() => {
        fetchReleases(pagination.currentPage, searchTerm, pagination.limit);
    }, [pagination.currentPage, searchTerm]);

    const fetchReleases = async (page = 1, search = "", currentLimit = pagination.limit) => {
        setLoading(true);
        try {
            let endpoint = `/releases?page=${page}&limit=${currentLimit}`;
            if (search) endpoint += `&search=${encodeURIComponent(search)}`;

            // Filter by create_type 'Saved' exclusively
            endpoint += `&create_type=Saved`;

            const response = await apiRequest(endpoint, "GET", null, true);
            if (response.success) {
                let fetchedReleases = response?.data?.data?.releases || [];

                setReleases(fetchedReleases);
                if (response?.data?.data?.pagination) {
                    setPagination(response.data.data.pagination);
                }
            } else {
                toast.error(response?.data?.message || "Failed to fetch saved releases");
            }
        } catch (error) {
            console.error("Fetch releases error:", error);
            toast.error("An error occurred while fetching saved releases");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        fetchReleases(1, searchTerm);
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handlePerPageChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
        fetchReleases(1, searchTerm, newLimit);
    };

    const handleOpenAssignModal = async (track, releaseId) => {
        setSelectedTrack({ ...track, releaseId });
        const existingIds = track.assignedEvents ? track.assignedEvents.map(a => a.eventId) : [];
        setSelectedEventIds(existingIds);

        try {
            const response = await apiRequest('/events?status=Active&limit=100', "GET", null, true);
            if (response.success) {
                setAvailableEvents(response.data.data?.data || response.data.data || []);
            }
        } catch (error) {
            console.error("Fetch events error:", error);
        }
    };

    const handleEventToggle = (eventId) => {
        setSelectedEventIds(prev =>
            prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, id]
        );
    };

    const handleAssignSubmit = async () => {
        if (!selectedTrack) return;
        setSubmittingAssignment(true);
        try {
            const payload = {
                trackId: selectedTrack._id,
                releaseId: selectedTrack.releaseId,
                eventIds: selectedEventIds
            };
            const response = await apiRequest('/assign-events', "POST", payload, true);
            if (response.success) {
                toast.success("Events assigned successfully");
                fetchReleases(pagination.currentPage, searchTerm, pagination.limit);
                const closeBtn = document.querySelector('#assignEventsModal .btn-close');
                if (closeBtn) closeBtn.click();
            } else {
                toast.error(response.data?.message || "Failed to assign events");
            }
        } catch (error) {
            console.error("Assign error:", error);
            toast.error("An error occurred");
        } finally {
            setSubmittingAssignment(false);
        }
    };

    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="view-release-sec bg-white p-4" style={{ borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
                    <div className="mb-4 pb-2">
                        <h6 className="mb-0 fw-bold clPurple" style={{ fontSize: '18px' }}>Saved Release</h6>
                    </div>

                    <div className="table-responsive">
                        {loading && (
                            <div className="text-center py-5">
                                <Loader message="Fetching saved releases..." variant="success" />
                            </div>
                        )}
                        {!loading && (
                            <>
                                <table className="table table-bordered align-middle">
                                    <thead className="table-light">
                                        <tr style={{ color: '#555', fontSize: '13px' }}>
                                            <th style={{ width: '100px' }}>Type</th>
                                            <th style={{ minWidth: '180px' }}>Title</th>
                                            <th style={{ minWidth: '110px' }}>Label</th>
                                            <th style={{ minWidth: '110px' }}>Release Date</th>
                                            <th style={{ minWidth: '90px' }}># Of Tracks</th>
                                            <th style={{ minWidth: '140px' }}>UPC / Catalogue</th>
                                            <th style={{ minWidth: '140px' }}>Comment</th>
                                            <th className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {releases.length > 0 ? (
                                            releases.map((release) => (
                                                <React.Fragment key={release._id}>
                                                    <tr style={{ fontSize: '14px', borderBottom: expandedReleases.includes(release._id) ? 'none' : '1px solid #f5f5f5' }}>
                                                        <td className="text-secondary">
                                                            <span>{release.release_type === 1 ? 'Single' : 'Album'}</span>
                                                        </td>
                                                        <td>
                                                            <div onClick={() => toggleReleaseTracks(release._id)} style={{ cursor: 'pointer' }}>
                                                                <span className="clPurple fw-medium">{release.release_title || 'Untitled'}</span>
                                                                <div className="text-muted" style={{ fontSize: '11px' }}>
                                                                    {release.primary_artist?.name || '-'}
                                                                    <i className={`fa-solid fa-chevron-${expandedReleases.includes(release._id) ? 'up' : 'down'} ms-2`} style={{ fontSize: '10px' }}></i>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    <td className="text-secondary">
                                                        {release.label?.name || '-'}
                                                    </td>
                                                    <td className="text-secondary">
                                                        {release.release_date ? new Date(release.release_date).toLocaleDateString() : '-'}
                                                    </td>
                                                    <td className="text-secondary">
                                                        {release.tracks?.length || 0}
                                                    </td>
                                                    <td className="text-secondary">
                                                        <div>{release.upc || '-'}</div>
                                                        <div className="text-muted mt-1" style={{ fontSize: '12px' }}>{release.catalogue_number || '-'}</div>
                                                    </td>
                                                    <td className="text-secondary" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <span title={release.admin_remarks || '-'}>
                                                            {release.admin_remarks || '-'}
                                                        </span>
                                                    </td>
                                                    <td className="text-center">
                                                        <button
                                                            className="mainBtn bgPurple clWhite"
                                                            onClick={() => navigate(`/edit-release/${release._id}`, { state: { from: '/saved-release' } })}
                                                        >
                                                            Continue
                                                        </button>
                                                    </td>
                                                </tr>
                                                {expandedReleases.includes(release._id) && (
                                                    <tr className="bg-light shadow-sm">
                                                        <td colSpan="8" className="p-0 border-0">
                                                            <div className="p-3 border-start border-4 border-purple">
                                                                <h6 className="fw-bold clPurple mb-3" style={{ fontSize: '13px' }}>Tracks in this Release</h6>
                                                                <div className="table-responsive border rounded bg-white">
                                                                    <table className="table table-sm table-hover mb-0">
                                                                        <thead className="bg-light">
                                                                            <tr style={{ fontSize: '11px' }}>
                                                                                <th className="px-3 py-2">Title</th>
                                                                                <th className="px-3 py-2">Artist</th>
                                                                                <th className="px-3 py-2">ISRC</th>
                                                                                <th className="px-3 py-2 text-center">Action</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            {release.tracks?.map((track, tidx) => (
                                                                                <tr key={tidx} style={{ fontSize: '12px' }}>
                                                                                    <td className="px-3 py-2">{track.title}</td>
                                                                                    <td className="px-3 py-2">{track.artist}</td>
                                                                                    <td className="px-3 py-2 text-muted">{track.isrc}</td>
                                                                                    <td className="px-3 py-2 text-center">
                                                                                        <button
                                                                                            className="btn btn-sm bgPurple clWhite"
                                                                                            style={{ fontSize: '10px', padding: '2px 8px' }}
                                                                                            data-bs-toggle="modal"
                                                                                            data-bs-target="#assignEventsModal"
                                                                                            onClick={() => handleOpenAssignModal(track, release._id)}
                                                                                        >
                                                                                            Promote
                                                                                        </button>
                                                                                    </td>
                                                                                </tr>
                                                                            ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="text-center py-4 text-muted border-0">No saved releases found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>

                </div>

                {/* Assign Events Modal */}
                <div className="modal fade" id="assignEventsModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold clPurple">Assign Events</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"><i className="fa-solid fa-xmark"></i></button>
                            </div>
                            <div className="modal-body">
                                <p className="text-muted mb-4" style={{ fontSize: '14px' }}>
                                    Assign upcoming events to track: <span className="fw-bold text-dark">{selectedTrack?.title}</span>
                                </p>

                                <div className="table-responsive border rounded">
                                    <table className="table table-hover mb-0 align-middle">
                                        <thead className="bg-light">
                                            <tr style={{ fontSize: '12px' }}>
                                                <th className="px-3 py-2" style={{ width: '50px' }}>Select</th>
                                                <th className="px-3 py-2">Event Title</th>
                                                <th className="px-3 py-2">Start Date</th>
                                                <th className="px-3 py-2">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {availableEvents.length > 0 ? (
                                                availableEvents.map(event => (
                                                    <tr key={event._id} style={{ fontSize: '12px' }}>
                                                        <td className="px-3 py-2 text-center">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                checked={selectedEventIds.includes(event._id)}
                                                                onChange={() => handleEventToggle(event._id)}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-2 fw-medium">{event.title}</td>
                                                        <td className="px-3 py-2">{event.start_date ? new Date(event.start_date).toLocaleDateString() : 'N/A'}</td>
                                                        <td className="px-3 py-2">
                                                            <span className="badge bg-success-subtle text-success border-success-subtle border px-2 py-1">
                                                                {event.status}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="4" className="text-center py-4 text-muted">No active events found.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer border-0 pt-0">
                                <button type="button" className="btn btn-light border px-4" data-bs-dismiss="modal" style={{ fontSize: '14px' }}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn bgPurple clWhite px-4"
                                    onClick={handleAssignSubmit}
                                    disabled={submittingAssignment}
                                    style={{ fontSize: '14px' }}
                                >
                                    {submittingAssignment ? 'Assigning...' : 'Assign Events'}
                                </button>
                            </div>
                        </div>
                    </div>
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
            </section>
        </>
    )
}

export default SavedReleaseComponent

