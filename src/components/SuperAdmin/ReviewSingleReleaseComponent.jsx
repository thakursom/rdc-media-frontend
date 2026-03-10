import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";

function ReviewSingleReleaseComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [release, setRelease] = useState(null);
    console.log("release", release);

    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [expandedTracks, setExpandedTracks] = useState([]);

    const [rejectData, setRejectData] = useState({ type: '', reason: '', file: null });
    const [approveComment, setApproveComment] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
        fetchReleaseDetails();
    }, [id]);

    const fetchReleaseDetails = async () => {
        try {
            const response = await apiRequest(`/releases/${id}`, "GET", null, true);
            if (response.success && response.data?.data) {
                setRelease(response.data.data);
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
                navigate('/review');
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
                navigate('/review');
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

    if (loading) {
        return (
            <section className="right-sidebar text-center py-5" id="sidebarRight">
                <Loader message="Loading release details..." />
            </section>
        );
    }

    if (!release) {
        return (
            <section className="right-sidebar py-5" id="sidebarRight">
                <div className="container">
                    <h4>Release not found.</h4>
                    <button className="btn bgPurple clWhite mt-3" onClick={() => navigate('/review')}>Back to Review</button>
                </div>
            </section>
        );
    }

    return (
        <section className="right-sidebar" id="sidebarRight">
            <div className="view-release-sec views-sec p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="clPurple mb-0">Views</h5>
                    <button className="btn bgPurple clWhite px-4 py-1" onClick={() => navigate('/review')}>Back</button>
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
                                    <button className="btn clWhite px-4" style={{ backgroundColor: '#0066b2' }} onClick={() => navigate(`/edit-release/${release.id}`)}>Edit</button>
                                    <button className="btn btn-danger px-4" data-bs-toggle="modal" data-bs-target="#rejectModal">Reject</button>
                                    <button className="btn bgPurple clWhite px-4" data-bs-toggle="modal" data-bs-target="#approveModal">Approve</button>
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
                                        <React.Fragment key={track.id || idx}>
                                            <tr style={{ borderBottom: expandedTracks.includes(idx) ? 'none' : '1px solid #eee' }}>
                                                <td className="px-4 py-3 border-0">
                                                    <span className="clPurple fw-medium" style={{ cursor: 'pointer', fontSize: '14px' }} onClick={() => toggleTrackDetail(idx)}>
                                                        {track.title}
                                                    </span>
                                                </td>
                                                <td className="px-2 py-3 border-0 text-secondary" style={{ fontSize: '13px' }}>{track.isrc || 'N/A'}</td>
                                                <td className="px-2 py-3 border-0 text-secondary" style={{ fontSize: '13px' }}>{track.artist || release.primary_artist?.name || 'N/A'}</td>
                                                <td className="px-2 py-3 border-0 text-secondary" style={{ fontSize: '13px' }}>{track.duration || '00:00'}</td>
                                                <td className="px-2 py-3 border-0 text-center">
                                                    <button className="btn bgPurple clWhite px-3 py-1" style={{ fontSize: '12px', borderRadius: '4px' }}>
                                                        <i className="fa-solid fa-bell me-1"></i> Promote
                                                    </button>
                                                </td>
                                                <td className="px-4 py-3 border-0 text-center">
                                                    <div className="d-flex align-items-center justify-content-center gap-2">
                                                        <audio
                                                            controls
                                                            src={track.audio_path}
                                                            style={{ height: '35px', width: '200px' }}
                                                            className="rounded bg-light"
                                                        />
                                                        {track.audio_path && (
                                                            <a href={track.audio_path} target="_blank" rel="noreferrer" className="text-secondary" title="Download">
                                                                <i className="fa-solid fa-download clPurple text-center" style={{ fontSize: '16px', border: '1px solid #ddd', padding: '6px', borderRadius: '4px' }}></i>
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                            {/* Expanded Detail Row */}
                                            {expandedTracks.includes(idx) && (
                                                <tr style={{ borderBottom: '1px solid #eee' }}>
                                                    <td colSpan="6" className="px-4 py-1 pb-4 border-0">
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
                            <button type="button" className="btn-close" id="closeRejectModal" data-bs-dismiss="modal" aria-label="Close" style={{ backgroundColor: '#888', padding: '4px', margin: '10px' }}></button>
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
                                <button type="button" className="btn text-white px-4" style={{ backgroundColor: '#6c757d' }} data-bs-dismiss="modal">Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-danger px-4"
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
                            <button type="button" className="btn-close bgPurple" id="closeApproveModal" data-bs-dismiss="modal" aria-label="Close" style={{ padding: '4px', margin: '10px' }}></button>
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
                                <button type="button" className="btn text-white px-4" style={{ backgroundColor: '#6c757d' }} data-bs-dismiss="modal">Cancel</button>
                                <button
                                    type="button"
                                    className="btn bgPurple text-white px-4"
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
        </section>
    );
}

export default ReviewSingleReleaseComponent;
