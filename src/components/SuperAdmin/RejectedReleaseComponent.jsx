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
                                    <option key={label.id || label._id} value={label.name || label.id}>{label.name}</option>
                                ))}
                            </select>
                        </div>
                        <button
                            className="btn bgPurple clWhite fw-medium px-4"
                            onClick={handleSearch}
                            style={{ borderRadius: '4px', fontSize: '14px', padding: '10px 15px', height: '43px' }}
                        >
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
                                <table className="table bg-white align-middle" style={{ border: '1px solid #eee' }}>
                                    <thead>
                                        <tr style={{ color: '#555', fontSize: '13px', borderBottom: '2px solid #eee' }}>
                                            <th className="px-3 py-3 fw-medium border-0 border-end">Type <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0 border-end">Title <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0 border-end">Artist <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0 border-end">Label <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0 border-end">Release Date <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0 border-end"># Of Tracks <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0 border-end">UPC / Catalogue <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0 border-end">Reason</th>
                                            <th className="px-3 py-3 fw-medium border-0">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {releases.length > 0 ? (
                                            releases.map((release) => (
                                                <tr key={release.id || release._id} style={{ borderBottom: '1px solid #eee', fontSize: '14px' }}>
                                                    <td className="px-3 py-3 border-0 text-dark">
                                                        <span>{release.release_type === 1 ? 'Single' : 'Album'}</span>
                                                    </td>
                                                    <td className="px-3 py-3 border-0 text-dark clPurple fw-medium">
                                                        {release.release_title || 'Untitled'}
                                                    </td>
                                                    <td className="px-3 py-3 border-0 text-secondary">
                                                        {release.primary_artist?.name || '-'}
                                                    </td>
                                                    <td className="px-3 py-3 border-0 text-secondary">
                                                        {release.label?.name || '-'}
                                                    </td>
                                                    <td className="px-3 py-3 border-0 text-secondary">
                                                        {release.release_date ? new Date(release.release_date).toLocaleDateString() : '-'}
                                                    </td>
                                                    <td className="px-3 py-3 border-0 text-secondary">
                                                        {release.tracks?.length || 0}
                                                    </td>
                                                    <td className="px-3 py-3 border-0 text-secondary" style={{ fontSize: '13px' }}>
                                                        <div>{release.upc || '-'}</div>
                                                        <div className="text-muted mt-1">{release.catalogue_number || '-'}</div>
                                                    </td>
                                                    <td className="px-3 py-3 border-0 text-secondary" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <span title={release.rejection_reason || release.admin_remarks || '-'}>
                                                            {release.rejection_reason || release.admin_remarks || '-'}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-3 border-0">
                                                        <button
                                                            className="btn bgPurple clWhite px-3 py-1"
                                                            style={{ fontSize: '12px', borderRadius: '4px' }}
                                                            data-bs-toggle="modal"
                                                            data-bs-target="#reasonModal"
                                                            onClick={() => setSelectedRelease(release)}
                                                        >
                                                            View Reason
                                                        </button>
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
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="correction-data p-3 bg-light rounded bg-opacity-50">
                                <p className="mb-0 text-dark">
                                    {selectedRelease?.rejection_reason || selectedRelease?.admin_remarks || "No reason provided by the reviewer. Please review your metadata and audio files carefully."}
                                </p>
                                {selectedRelease?.rejection_file && (
                                    <div className="mt-3">
                                        <a
                                            href={selectedRelease.rejection_file}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="btn btn-sm bgPurple clWhite"
                                            style={{ textDecoration: 'none' }}
                                        >
                                            <i className="fa-solid fa-paperclip me-1"></i> View Attachment
                                        </a>
                                    </div>
                                )}
                            </div>
                            <div className="correction-btn text-center mt-4 mb-2">
                                <Link to={`/edit-release/${selectedRelease?.id || selectedRelease?._id}`} className="btn px-4 py-2 bgPurple clWhite" style={{ borderRadius: '4px' }} data-bs-dismiss="modal">
                                    Make Correction
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default RejectedReleaseComponent

