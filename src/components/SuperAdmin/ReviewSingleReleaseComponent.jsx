import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";

function ReviewSingleReleaseComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || '/review';

    const [release, setRelease] = useState(null);

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [expandedTracks, setExpandedTracks] = useState([]);

    const [rejectData, setRejectData] = useState({ type: '', reason: '', file: null });
    const [approveComment, setApproveComment] = useState('');

    // Promote (Track Event Assignment) State
    const [selectedTrack, setSelectedTrack] = useState(null);
    const [availableEvents, setAvailableEvents] = useState([]);
    const [selectedEventIds, setSelectedEventIds] = useState([]);
    const [submittingAssignment, setSubmittingAssignment] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchReleaseDetails();
    }, [id]);

    const formatDuration = (duration) => {
        if (!duration) return '00:00';
        if (typeof duration === 'string' && duration.includes(':')) return duration;
        const totalSeconds = Number(duration) || 0;
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const fetchReleaseDetails = async () => {
        try {
            const response = await apiRequest(`/releases/${id}`, "GET", null, true);
            if (response.success && response.data?.data) {
                const fetchedRelease = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
                setRelease(fetchedRelease);
            } else {
                toast.error(response?.data?.message || "Failed to fetch release details");
            }
        } catch (error) {
            console.error("Fetch release error:", error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        setUpdating(true);
        try {
            const hasTracks = release && release.tracks && release.tracks.length > 0;
            const payload = {
                status: "1",
                create_type: hasTracks ? 'Approved' : 'Saved',
                admin_remarks: approveComment
            };
            const response = await apiRequest(`/update-release-status/${id}`, "PUT", payload, true);

            if (response.success) {
                toast.success('Release Approved successfully');
                document.getElementById('closeApproveModal')?.click();
                navigate(from);
            } else {
                toast.error(response?.data?.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Status update error:", error);
            toast.error("An error occurred while updating status");
        } finally {
            setUpdating(false);
        }
    };

    const handleReject = async () => {
        if (!rejectData.reason) {
            toast.error("Please provide a reason for rejection");
            return;
        }
        setUpdating(true);
        try {
            const formData = new FormData();
            formData.append('status', '2');
            formData.append('create_type', 'Rejected');
            formData.append('rejection_type', rejectData.type);
            formData.append('admin_remarks', rejectData.reason);
            formData.append('rejection_reason', rejectData.reason);

            if (rejectData.file) {
                formData.append('rejection_file', rejectData.file);
            }

            const response = await apiRequest(`/update-release-status/${id}`, "PUT", formData, true);

            if (response.success) {
                toast.success('Release Rejected successfully');
                document.getElementById('closeRejectModal')?.click();
                navigate(from);
            } else {
                toast.error(response?.data?.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Status update error:", error);
            toast.error("An error occurred while updating status");
        } finally {
            setUpdating(false);
        }
    };

    const toggleTrackDetail = (idx) => {
        setExpandedTracks(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        );
    };

    // Promote (Track Event Assignment) Handlers
    const handleOpenAssignModal = async (track, releaseId) => {
        setSelectedTrack({ ...track, releaseId });

        // Pre-select existing event IDs if available
        const existingEventIds = track.assignedEvents ? track.assignedEvents.map(a => a.eventId) : [];

        setSelectedEventIds(existingEventIds);

        try {
            const response = await apiRequest('/events?status=Active&limit=100', "GET", null, true);
            if (response.success) {
                setAvailableEvents(response.data.data || []);
            } else {
                toast.error("Failed to fetch active events");
            }
        } catch (error) {
            console.error("Fetch events error:", error);
            toast.error("An error occurred while fetching events");
        }
    };

    const handleEventToggle = (eventId) => {
        setSelectedEventIds(prev =>
            prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
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
                toast.success(response.data?.message || "Events assigned successfully");
                // Close modal using data-bs-dismiss trigger or check window.bootstrap
                const modalElement = document.getElementById('assignEventsModal');
                if (window.bootstrap && window.bootstrap.Modal) {
                    const modal = window.bootstrap.Modal.getInstance(modalElement);
                    if (modal) modal.hide();
                } else {
                    const closeBtn = modalElement?.querySelector('[data-bs-dismiss="modal"]');
                    if (closeBtn) closeBtn.click();
                }
                // Refresh data to get updated assignments
                fetchReleaseDetails();
            } else {
                toast.error(response.data?.message || "Failed to assign events");
            }
        } catch (error) {
            console.error("Assign events error:", error);
            toast.error("An error occurred while assigning events");
        } finally {
            setSubmittingAssignment(false);
        }
    };

    if (loading) {
        return (
            <section className="right-sidebar text-center py-5" id="sidebarRight">
                <Loader message="Loading release details..." variant="success" />
            </section>
        );
    }

    if (!release) {
        return (
            <section className="right-sidebar py-5" id="sidebarRight">
                <div className="container">
                    <h4>Release not found.</h4>
                    <button className="btn bgPurple clWhite mt-3" onClick={() => navigate(from)}>Back to Review</button>
                </div>
            </section>
        );
    }

    return (
        <section className="right-sidebar" id="sidebarRight">
            <div className="view-release-sec views-sec p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="clPurple mb-0">Views</h5>
                    <button className="mainBtn bgPurple clWhite" onClick={() => navigate(from)}>Back</button>
                </div>

                {/* Main Release Card */}
                <div className="card border-0 mb-4 bg-white" style={{ borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
                    <div className="card-body p-4">
                        <div className="row">
                            <div className="col-md-3 text-center mb-3 mb-md-0">
                                <img
                                    src={release.artwork_path || "https://via.placeholder.com/250"}
                                    alt="Artwork"
                                    className="img-fluid rounded"
                                    style={{ width: '100%', maxWidth: '250px', objectFit: 'cover', aspectRatio: '1/1' }}
                                />
                            </div>
                            <div className="col-md-9">
                                <h4 className="clPurple fw-bold mb-4">{release.release_title || 'N/A'}</h4>

                                <div className="row mb-4">
                                    <div className="col-md-4 mb-2">
                                        <span className="text-secondary" style={{ fontSize: '14px' }}>Artist : </span>
                                        <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.primary_artist?.name || 'N/A'}</span>
                                    </div>
                                    <div className="col-md-4 mb-2">
                                        <span className="text-secondary" style={{ fontSize: '14px' }}>Label : </span>
                                        <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.label?.name || 'N/A'}</span>
                                    </div>
                                    <div className="col-md-4 mb-2">
                                        <span className="text-secondary" style={{ fontSize: '14px' }}>Genre : </span>
                                        <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.genre_name || 'N/A'}</span>
                                    </div>

                                    <div className="col-md-4 mb-2">
                                        <span className="text-secondary" style={{ fontSize: '14px' }}>UPC : </span>
                                        <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.upc || 'N/A'}</span>
                                    </div>
                                    <div className="col-md-4 mb-2">
                                        <span className="text-secondary" style={{ fontSize: '14px' }}>Product Type : </span>
                                        <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>
                                            {typeof release.release_type === 'number'
                                                ? (release.release_type === 1 ? 'single' : 'album')
                                                : (release.release_type || 'N/A')}
                                        </span>
                                    </div>
                                    <div className="col-md-4 mb-2">
                                        <span className="text-secondary" style={{ fontSize: '14px' }}>Release Date : </span>
                                        <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>
                                            {release.release_date ? new Date(release.release_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                                        </span>
                                    </div>

                                    <div className="col-md-4 mb-2">
                                        <span className="text-secondary" style={{ fontSize: '14px' }}>Preorder Data : </span>
                                        <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>-</span>
                                    </div>
                                    <div className="col-md-4 mb-2">
                                        <span className="text-secondary" style={{ fontSize: '14px' }}>Meta Language : </span>
                                        <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.language_name || 'N/A'}</span>
                                    </div>


                                    <div className="col-md-4 mb-2">
                                        <span className="text-secondary" style={{ fontSize: '14px' }}>Catalogue Number : </span>
                                        <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.catalogue_number || 'N/A'}</span>
                                    </div>
                                    <div className="col-md-4 mb-2">
                                        <span className="text-secondary" style={{ fontSize: '14px' }}>© C-Line : </span>
                                        <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.c_line || 'N/A'}</span>
                                    </div>
                                    <div className="col-md-4 mb-2">
                                        <span className="text-secondary" style={{ fontSize: '14px' }}>C-Line Year : </span>
                                        <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.c_line_year || 'N/A'}</span>
                                    </div>

                                    <div className="col-md-4 mb-2">
                                        <span className="text-secondary" style={{ fontSize: '14px' }}>℗ P-Line : </span>
                                        <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.p_line || 'N/A'}</span>
                                    </div>
                                    <div className="col-md-4 mb-2">
                                        <span className="text-secondary" style={{ fontSize: '14px' }}>P-Line Year : </span>
                                        <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.p_line_year || 'N/A'}</span>
                                    </div>
                                </div>

                                <div className="d-flex gap-2">
                                    <button className="mainBtn bgPurple clWhite" onClick={() => navigate(`/edit-release/${release._id}`, { state: { from } })}>Edit</button>
                                    <button className="mainBtn bgRed clWhite" data-bs-toggle="modal" data-bs-target="#rejectModal">Reject</button>
                                    <button className="mainBtn bgPurple clWhite" data-bs-toggle="modal" data-bs-target="#approveModal">Approve</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tracks Section */}
                <div className="card border-0 bg-white" style={{ borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
                    <div className="card-header bg-light border-0 d-flex justify-content-between align-items-center py-3 px-4">
                        <h4 className="mb-0 text-dark fw-bold" style={{ fontSize: '20px' }}>Volume 1</h4>
                        <span className="clPurple" style={{ cursor: 'pointer', fontSize: '14px' }}>Show Detail</span>
                    </div>
                    <div className="card-body p-0">
                        {release.tracks && release.tracks.length > 0 ? (
                            <table className="table mb-0 align-middle">
                                <thead>
                                    <tr style={{ color: '#888', fontSize: '13px', borderBottom: '2px solid #eee' }}>
                                        <th className="px-4 py-3 fw-normal border-0" style={{ width: '25%' }}>Title</th>
                                        <th className="px-2 py-3 fw-normal border-0" style={{ width: '15%' }}>ISRC</th>
                                        <th className="px-2 py-3 fw-normal border-0" style={{ width: '15%' }}>Artist</th>
                                        <th className="px-2 py-3 fw-normal border-0" style={{ width: '10%' }}>Duration</th>
                                        <th className="px-2 py-3 fw-normal border-0 text-center" style={{ width: '10%' }}>Promote</th>
                                        <th className="px-4 py-3 fw-normal border-0 text-center" style={{ width: '25%' }}>Audio File</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {release.tracks.map((track, idx) => (
                                        <React.Fragment key={track._id || idx}>
                                            <tr style={{ borderBottom: expandedTracks.includes(idx) ? 'none' : '1px solid #eee' }}>
                                                <td className="px-4 py-3 border-0">
                                                    <span className="clPurple fw-medium" style={{ cursor: 'pointer', fontSize: '12px' }} onClick={() => toggleTrackDetail(idx)}>
                                                        {track.title} {track.mix_version ? `(${track.mix_version})` : ''}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-3 border-0 text-secondary" style={{ fontSize: '12px' }}>{track.isrc_number || track.isrc || 'N/A'}</td>
                                                <td className="px-2 py-3 border-0 text-secondary" style={{ fontSize: '12px' }}>{track.artist || release.primary_artist?.name || 'N/A'}</td>
                                                <td className="px-2 py-3 border-0 text-secondary" style={{ fontSize: '12px' }}>{formatDuration(track.duration)}</td>
                                                <td className="px-2 py-3 border-0 text-center">
                                                    <button className="mainBtn bgPurple clWhite"
                                                        style={{ fontSize: '12px', borderRadius: '4px' }}
                                                        data-bs-toggle="modal"
                                                        data-bs-target="#assignEventsModal"
                                                        onClick={() => handleOpenAssignModal(track, release._id)}
                                                    >
                                                        <i className="fa-solid fa-bell me-1"></i> Promote
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3 border-0 text-center">
                                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                                        <audio
                                                            controls
                                                            src={(track.preview_start !== undefined && track.preview_start !== null) ? `${track.audio_path}#t=${track.preview_start}` : track.audio_path}
                                                            style={{ height: '35px', width: '200px' }}
                                                            className="rounded bg-light"
                                                        />
                                                        {track.audio_path && (
                                                            <>
                                                                <a href={track.audio_path} target="_blank" rel="noreferrer" className="text-secondary" title="Download">
                                                                    <i className="fa-solid fa-download clPurple text-center" style={{ fontSize: '16px', border: '1px solid #ddd', padding: '6px', borderRadius: '4px' }}></i>
                                                                </a>
                                                            </>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Expanded Detail Row */}
                                            {expandedTracks.includes(idx) && (
                                                <tr style={{ borderBottom: '1px solid #eee' }}>
                                                    <td colSpan="5" className="px-4 py-1 pb-4 border-0">
                                                        <div className="ms-3 pt-2">
                                                            <div className="mb-2">
                                                                <h6 className="clPurple mb-1" style={{ fontSize: '13px', fontWeight: 'bold' }}>Roles</h6>
                                                                <span className="text-secondary me-3" style={{ fontSize: '12px' }}>Remixer: <span className="text-dark opacity-50">{track.remixer || 'Not Provided'}</span></span>
                                                                <span className="text-secondary me-3" style={{ fontSize: '12px' }}>Artists: <span className="text-dark opacity-50">{track.artist || release.primary_artist?.name || '-'}</span></span>
                                                                <span className="text-secondary" style={{ fontSize: '12px' }}>Composer: <span className="text-dark opacity-50">{track.composer || '-'}</span></span>
                                                                <span className="text-secondary ms-3" style={{ fontSize: '12px' }}>Producer: <span className="text-dark opacity-50">{track.producer || '-'}</span></span>
                                                                <span className="text-secondary ms-3" style={{ fontSize: '12px' }}>Lyricist: <span className="text-dark opacity-50">{track.lyricist || '-'}</span></span>
                                                            </div>
                                                            <div>
                                                                <h6 className="clPurple mb-1" style={{ fontSize: '13px', fontWeight: 'bold' }}>Information</h6>
                                                                <span className="text-secondary me-3" style={{ fontSize: '12px' }}>ISRC: <span className="text-dark opacity-50">{track.isrc_number || '-'}</span></span>
                                                                <span className="text-secondary" style={{ fontSize: '12px' }}>Language: <span className="text-dark opacity-50">{release.language_name || 'N/A'}</span></span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-muted p-4 text-center">No tracks found for this release.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Reject Modal */}
            <div className="modal fade" id="rejectModal" tabIndex="-1" aria-labelledby="rejectModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={{ borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title clPurple fw-bold" id="rejectModalLabel">Reject Reason</h5>
                            <button type="button" className="btn-close ms-auto" id="closeRejectModal" data-bs-dismiss="modal" aria-label="Close"><i className="fa-solid fa-xmark" /></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label text-dark" style={{ fontSize: '14px' }}>Rejection Type</label>
                                <select
                                    className="form-select"
                                    style={{ border: '1px solid #ddd', boxShadow: 'none' }}
                                    value={rejectData.type}
                                    onChange={(e) => setRejectData({ ...rejectData, type: e.target.value })}
                                >
                                    <option value="">Select a reason</option>
                                    <option value="Metadata Issue">Metadata Issue</option>
                                    <option value="Audio Quality">Audio Quality</option>
                                    <option value="Artwork Issue">Artwork Issue</option>
                                    <option value="Copyright Issue">Copyright Issue</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="mb-3">
                                <label className="form-label text-dark" style={{ fontSize: '14px' }}>Please provide the reason for rejection</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Enter reason here..."
                                    style={{ border: '1px solid #ddd', resize: 'none', boxShadow: 'none' }}
                                    value={rejectData.reason}
                                    onChange={(e) => setRejectData({ ...rejectData, reason: e.target.value })}
                                ></textarea>
                            </div>
                            <div className="mb-4">
                                <label className="form-label text-dark" style={{ fontSize: '14px' }}>Attach File (Image, PDF, or CSV)</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    style={{ border: '1px solid #ddd', boxShadow: 'none' }}
                                    onChange={(e) => setRejectData({ ...rejectData, file: e.target.files[0] })}
                                />
                            </div>
                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="mainBtn bgGray clWhite" data-bs-dismiss="modal">Cancel</button>
                                <button
                                    type="button"
                                    className="mainBtn bgPurple clWhite"
                                    onClick={handleReject}
                                    disabled={updating}
                                >
                                    {updating ? 'Submitting...' : 'Submit'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Approve Modal */}
            <div className="modal fade" id="approveModal" tabIndex="-1" aria-labelledby="approveModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content" style={{ borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title clPurple fw-bold" id="approveModalLabel">Approve Release</h5>
                            <button type="button" className="btn-close ms-auto" id="closeApproveModal" data-bs-dismiss="modal" aria-label="Close">
                                <i className="fa-solid fa-xmark" />
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-4">
                                <label className="form-label text-dark" style={{ fontSize: '14px' }}>Optional Comment</label>
                                <textarea
                                    className="form-control"
                                    rows="4"
                                    placeholder="Enter comment..."
                                    style={{ border: '1px solid #ddd', resize: 'none', boxShadow: 'none' }}
                                    value={approveComment}
                                    onChange={(e) => setApproveComment(e.target.value)}
                                ></textarea>
                            </div>
                            <div className="d-flex justify-content-end gap-2">
                                <button type="button" className="mainBtn bgRed clWhite" data-bs-dismiss="modal">Cancel</button>
                                <button
                                    type="button"
                                    className="mainBtn bgPurple clWhite"
                                    onClick={handleApprove}
                                    disabled={updating}
                                >
                                    {updating ? 'Approving...' : 'Approve'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Assign Events Modal */}
            <div className="modal fade" id="assignEventsModal" tabIndex="-1" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header border-0 pb-0">
                            <h5 className="modal-title fw-bold clPurple">Assign Events</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
                        </div>
                        <div className="modal-body">
                            <p className="text-muted mb-4" style={{ fontSize: '14px' }}>
                                Assign upcoming events to track: <span className="fw-bold text-dark">{selectedTrack?.title}</span>
                            </p>

                            <div className="table-responsive border rounded">
                                <table className="table table-hover mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th style={{ width: '80px' }}>Select</th>
                                            <th>Title</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {availableEvents.length > 0 ? (
                                            availableEvents.map(event => (
                                                <tr key={event._id}>
                                                    <td>
                                                        <div className="form-check d-flex justify-content-center">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                checked={selectedEventIds.includes(event._id)}
                                                                onChange={() => handleEventToggle(event._id)}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td style={{ fontSize: '14px' }}>{event.title}</td>
                                                    <td style={{ fontSize: '14px' }}>{new Date(event.eventDate).toLocaleDateString()}</td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="text-center py-4 text-muted">No active events found. Please create events first.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div className="modal-footer border-0">
                            <button type="button" className="mainBtn bgGray clWhite" data-bs-dismiss="modal">Close</button>
                            <button
                                type="button"
                                className="mainBtn bgPurple clWhite d-flex align-items-center gap-2"
                                onClick={handleAssignSubmit}
                                disabled={submittingAssignment}
                            >
                                {submittingAssignment ? (
                                    <><i className="fa-solid fa-spinner fa-spin"></i> Submitting...</>
                                ) : (
                                    <><i className="fa-solid fa-check"></i> Submit</>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ReviewSingleReleaseComponent;
