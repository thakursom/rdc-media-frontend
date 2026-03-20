import React, { useState, useEffect } from 'react';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";

function RejectedReleaseComponent() {
    const [releases, setReleases] = useState([]);
    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLabel, setSelectedLabel] = useState("");
    const [pagination, setPagination] = useState({
        totalDocs: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });
    const [selectedRelease, setSelectedRelease] = useState(null);
    console.log("selectedRelease", selectedRelease);

    useEffect(() => {
        fetchReleases(pagination.currentPage, searchTerm, pagination.limit, selectedLabel);
        fetchLabels();
    }, [pagination.currentPage, searchTerm, selectedLabel]);

    const fetchLabels = async () => {
        try {
            const labelRes = await apiRequest("/all-labels", "GET", null, true);
            if (labelRes.success) setLabels(labelRes?.data?.data || []);
        } catch (error) {
            console.error("Fetch labels error:", error);
        }
    };

    const fetchReleases = async (page = 1, search = "", currentLimit = pagination.limit, label = "") => {
        setLoading(true);
        try {
            let endpoint = `/releases?page=${page}&limit=${currentLimit}`;
            if (search) endpoint += `&search=${encodeURIComponent(search)}`;
            if (label) endpoint += `&label=${encodeURIComponent(label)}`;

            // Filter strictly by status 2 AND creation type 'Rejected'
            endpoint += `&statuses=2&create_type=Rejected`;

            const response = await apiRequest(endpoint, "GET", null, true);
            if (response.success) {
                let fetchedReleases = response?.data?.data?.releases || [];

                setReleases(fetchedReleases);
                if (response?.data?.data?.pagination) {
                    setPagination(response.data.data.pagination);
                }
            } else {
                toast.error(response?.data?.message || "Failed to fetch rejected releases");
            }
        } catch (error) {
            console.error("Fetch releases error:", error);
            toast.error("An error occurred while fetching rejected releases");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        if (e && e.preventDefault) e.preventDefault();
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        fetchReleases(1, searchTerm, pagination.limit, selectedLabel);
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handlePerPageChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
        fetchReleases(1, searchTerm, newLimit, selectedLabel);
    };

    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="view-release-sec bg-white p-4" style={{ borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
                    <div className="mb-4 pb-2">
                        <h6 className="mb-0 fw-bold clPurple" style={{ fontSize: '18px' }}>Rejected Releases</h6>
                    </div>

                    {/* Filter Bar */}
                    <div className="d-flex gap-3 mb-4 align-items-end flex-wrap">
                        <div style={{ flex: '1', minWidth: '250px', maxWidth: '400px' }}>
                            <label className="form-label text-secondary mb-1" style={{ fontSize: '14px' }}>Search..</label>
                            <form onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSearchTerm(val);
                                        if (val === '') {
                                            setPagination(prev => ({ ...prev, currentPage: 1 }));
                                        }
                                    }}
                                    style={{ border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', padding: '10px 15px' }}
                                />
                            </form>
                        </div>
                        <div style={{ flex: '1', minWidth: '250px', maxWidth: '350px' }}>
                            <label className="form-label text-secondary mb-1" style={{ fontSize: '14px' }}>Filter by Label</label>
                            <select
                                className="form-select text-secondary"
                                style={{ border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', padding: '10px 15px', color: '#6c757d' }}
                                value={selectedLabel}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSelectedLabel(val);
                                    setPagination(prev => ({ ...prev, currentPage: 1 }));
                                }}
                            >
                                <option value="">Search label...</option>
                                {labels.map(label => (
                                    <option key={label._id} value={label.name || label._id}>{label.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            className="mainBtn bgPurple clWhite"
                            onClick={handleSearch} >
                            Search
                        </button>
                    </div>

                    <div className="table-responsive">
                        {loading && (
                            <div className="text-center py-5">
                                <Loader message="Fetching rejected releases..." variant="danger" />
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
                                            <th className="text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {releases.length > 0 ? (
                                            releases.map((release) => (
                                                <tr key={release._id} style={{ fontSize: '14px' }}>
                                                    <td className="text-secondary">
                                                        <span>{release.release_type === 1 ? 'Single' : 'Album'}</span>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <span className="clPurple fw-medium">{release.release_title || 'Untitled'}</span>
                                                            <div className="text-muted" style={{ fontSize: '12px' }}>{release.primary_artist?.name || '-'}</div>
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
                                                    <td className="text-center">
                                                        <div className="d-flex gap-2 justify-content-center">
                                                            <button
                                                                className="mainBtn bgPurple clWhite"
                                                                data-bs-toggle="modal"
                                                                data-bs-target="#reasonModal"
                                                                onClick={() => setSelectedRelease(release)}
                                                                style={{ fontSize: '12px' }}
                                                            >
                                                                View Reason
                                                            </button>
                                                            <Link
                                                                to={`/edit-release/${release._id}`}
                                                                className="mainBtn bgPurple clWhite"
                                                                style={{ textDecoration: 'none', fontSize: '12px' }}
                                                            >
                                                                Edit
                                                            </Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="9" className="text-center py-4 text-muted border-0">No rejected releases found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </>
                        )}
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

            {/* Modal for Reject Reason */}
            <div
                className="modal fade ma-correction"
                id="reasonModal"
                tabIndex={-1}
                aria-labelledby="reasonModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-0">
                            <h5 className="modal-title clPurple fw-bold" id="reasonModalLabel">Reason for Rejection</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"><i className="fa-solid fa-xmark"></i></button>
                        </div>
                        <div className="modal-body p-4">
                            <div className="d-flex align-items-center mb-4 pb-3 border-bottom">
                                <div className="bg-danger bg-opacity-10 p-2 rounded-3 me-3">
                                    <i className="fa-solid fa-triangle-exclamation text-danger fs-4"></i>
                                </div>
                                <div>
                                    <h6 className="mb-0 fw-bold text-dark">Reviewer's Feedback</h6>
                                    <small className="text-secondary">Please correct these issues and re-submit for review.</small>
                                </div>
                            </div>

                            <div className="row g-3 mb-4">
                                <div className="col-12">
                                    <div className="p-3 bg-light rounded-3 border-start border-4 border-purple" style={{ borderLeftColor: '#6f42c1' }}>
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <span className="text-secondary fw-semibold" style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Release Title</span>
                                            <i className="fa-solid fa-music text-secondary opacity-50" style={{ fontSize: '12px' }}></i>
                                        </div>
                                        <div className="clPurple fw-bold fs-5">{selectedRelease?.release_title}</div>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="p-3 bg-white border rounded-3 h-100 shadow-sm transition-all hover-shadow">
                                        <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Rejection Type</span>
                                        <span className="badge bg-danger bg-opacity-10 text-danger border border-danger border-opacity-25 px-2 py-1">
                                            {selectedRelease?.rejection_type}
                                        </span>
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="p-3 bg-white border rounded-3 h-100 shadow-sm transition-all hover-shadow">
                                        <span className="text-secondary fw-semibold d-block mb-1" style={{ fontSize: '11px', textTransform: 'uppercase' }}>Associated File</span>
                                        {selectedRelease?.rejection_file ? (
                                            <a href={selectedRelease.rejection_file} target="_blank" rel="noreferrer" className="clPurple text-decoration-none d-flex align-items-center gap-1 fw-medium mt-1" style={{ fontSize: '13px' }}>
                                                <i className="fa-solid fa-file-pdf"></i> View Attachment
                                            </a>
                                        ) : (
                                            <span className="text-muted italic mt-1 d-block" style={{ fontSize: '13px' }}>No attachment found</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="fw-bold text-dark d-block mb-2" style={{ fontSize: '14px' }}>
                                    <i className="fa-solid fa-comment-dots me-2 clPurple"></i>Detailed Reason:
                                </label>
                                <div className="p-4 bg-light rounded-4 border-0" style={{ minHeight: '100px', backgroundColor: '#f9f9fb', border: '1px dashed #ced4da' }}>
                                    <p className="mb-0 text-dark" style={{ fontSize: '14px', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                                        {selectedRelease?.rejection_reason || selectedRelease?.admin_remarks || "No detailed reason provided. Please review your metadata and audio files carefully."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RejectedReleaseComponent

