import React, { useState, useEffect } from 'react';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";

function ReviewComponent() {
    const [releases, setReleases] = useState([]);
    console.log("releases", releases);

    const [labels, setLabels] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLabel, setSelectedLabel] = useState("");
    const [selectedReleases, setSelectedReleases] = useState([]);
    const [showBulkApproveModal, setShowBulkApproveModal] = useState(false);
    const [pagination, setPagination] = useState({
        totalDocs: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });

    useEffect(() => {
        fetchReleases(pagination.currentPage, searchTerm, pagination.limit, selectedLabel);
        fetchLabels();
    }, [pagination.currentPage, searchTerm, selectedLabel]);

    const fetchLabels = async () => {
        try {
            const labelRes = await apiRequest("/all-labels?limit=1000", "GET", null, true);
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

            endpoint += `&create_type=Pending`;

            const response = await apiRequest(endpoint, "GET", null, true);
            if (response.success) {
                let fetchedReleases = response?.data?.data?.releases || [];
                setReleases(fetchedReleases);
                if (response?.data?.data?.pagination) {
                    setPagination(response.data.data.pagination);
                }
            } else {
                toast.error(response?.data?.message || "Failed to fetch releases");
            }
        } catch (error) {
            console.error("Fetch releases error:", error);
            toast.error("An error occurred while fetching releases");
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
        fetchReleases(1, searchTerm, newLimit);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            const allIds = releases.map(r => r._id);
            setSelectedReleases(allIds);
        } else {
            setSelectedReleases([]);
        }
    };

    const handleSelectRow = (e, id) => {
        if (e.target.checked) {
            setSelectedReleases(prev => [...prev, id]);
        } else {
            setSelectedReleases(prev => prev.filter(selId => selId !== id));
        }
    };

    const handleBulkApprove = () => {
        if (selectedReleases.length === 0) {
            toast.warn("Please select at least one release to approve.");
            return;
        }
        setShowBulkApproveModal(true);
    };

    const confirmBulkApprove = async () => {
        setLoading(true);
        setShowBulkApproveModal(false);
        try {
            const promises = selectedReleases.map(id => {
                const release = releases.find(r => (r._id === id || r._id === id));
                const hasTracks = release && release.tracks && release.tracks.length > 0;

                const payload = {
                    status: "1",
                    create_type: hasTracks ? 'Approved' : 'Saved',
                    admin_remarks: "Bulk Approved"
                };
                return apiRequest(`/update-release-status/${id}`, "PUT", payload, true);
            });
            await Promise.all(promises);
            toast.success(`${selectedReleases.length} releases approved successfully`);
            setSelectedReleases([]);
            fetchReleases(pagination.currentPage, searchTerm);
        } catch (error) {
            console.error("Bulk approve error:", error);
            toast.error("An error occurred during bulk approve");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="view-release-sec bg-white p-4" style={{ borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>

                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4 pb-3" style={{ borderBottom: '1px solid #eee' }}>
                        <h6 className="mb-0 fw-bold clPurple" style={{ fontSize: '16px' }}>Content in Review</h6>
                        <button
                            className="mainBtn bgPurple clWhite"
                            onClick={handleBulkApprove}
                        >
                            Bulk Approve
                        </button>
                    </div>

                    {/* Confirmation Modal */}
                    {showBulkApproveModal && (
                        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-dialog-centered">
                                <div className="modal-content" style={{ borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' }}>
                                    <div className="modal-header border-0 pb-0">
                                        <h5 className="modal-title clPurple fw-bold">Bulk Approve</h5>
                                        <button type="button" className="btn-close" onClick={() => setShowBulkApproveModal(false)}></button>
                                    </div>
                                    <div className="modal-body py-4">
                                        <p className="mb-0" style={{ fontSize: '15px' }}>
                                            Are you sure you want to approve <strong>{selectedReleases.length}</strong> {selectedReleases.length === 1 ? 'release' : 'releases'}?
                                        </p>
                                    </div>
                                    <div className="modal-footer border-0 pt-0">
                                        <button type="button" className="mainBtn bgRed clWhite" onClick={() => setShowBulkApproveModal(false)}>Cancel</button>
                                        <button type="button" className="mainBtn bgPurple clWhite" onClick={confirmBulkApprove}>Approve</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Filter Bar */}
                    <div className="d-flex gap-3 mb-4 align-items-center">
                        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '250px' }}>
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
                                        fetchReleases(1, '');
                                    }
                                }}
                                style={{ border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', padding: '10px 15px' }}
                            />
                        </form>
                        <select
                            className="form-select text-secondary"
                            style={{ flex: 1, maxWidth: '200px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', padding: '10px 15px', color: '#6c757d' }}
                            value={selectedLabel}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSelectedLabel(val);
                                setPagination(prev => ({ ...prev, currentPage: 1 }));
                            }}
                        >
                            <option value="">Select Label</option>
                            {labels.map(label => (
                                <option key={label._id} value={label.name || label._id}>{label.name}</option>
                            ))}
                        </select>
                        {/* <select className="form-select text-secondary" style={{ flex: 1, maxWidth: '200px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '14px', padding: '10px 15px', color: '#6c757d' }}>
                            <option value="">All</option>
                        </select> */}
                        {/* <button className="btn text-white px-4 fw-medium" onClick={handleSearch} style={{ backgroundColor: '#0066b2', borderRadius: '4px', fontSize: '14px', padding: '10px 15px', minWidth: '90px' }}>
                            Apply
                        </button>
                        <button className="btn text-white px-4 fw-medium" onClick={() => { setSearchTerm(''); setSelectedLabel(''); fetchReleases(1, '', pagination.limit, ''); }} style={{ backgroundColor: '#6c757d', borderRadius: '4px', fontSize: '14px', padding: '10px 15px', minWidth: '90px' }}>
                            Clear
                        </button> */}
                    </div>

                    {/* Table */}
                    <div className="table-responsive">
                        {loading && (
                            <div className="text-center py-5">
                                <Loader message="Fetching pending releases..." />
                            </div>
                        )}
                        {!loading && (
                            <>
                                <table className="table bg-white align-middle" style={{ border: '1px solid #eee' }} id="review-table">
                                    <thead>
                                        <tr style={{ color: '#777', fontSize: '13px', borderBottom: '2px solid #eee' }}>
                                            <th className="px-3 py-3 fw-medium border-0" style={{ width: '5%' }}>
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    onChange={handleSelectAll}
                                                    checked={releases.length > 0 && selectedReleases.length === releases.length}
                                                />
                                            </th>
                                            <th className="px-3 py-3 fw-medium border-0">Album Name <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0">Track Name <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0">UPC <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0">ISRC <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0">Artist Name <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0">Label Name <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0 text-center">Status <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0">Date/Time <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0 text-center">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {releases.length > 0 ? (
                                            releases.map((release) => {
                                                const id = release?._id;
                                                console.log("id", id);

                                                return (
                                                    <tr key={release._id} style={{ borderBottom: '1px solid #eee', fontSize: '14px' }}>
                                                        <td className="px-3 py-3 border-0">
                                                            <input
                                                                type="checkbox"
                                                                className="form-check-input"
                                                                checked={selectedReleases.includes(id)}
                                                                onChange={(e) => handleSelectRow(e, id)}
                                                            />
                                                        </td>
                                                        <td className="px-3 py-3 border-0 clPurple">
                                                            <span>{release.release_title || 'Untitled'}</span>
                                                        </td>
                                                        <td className="px-3 py-3 border-0 text-secondary">
                                                            {release.tracks && release.tracks[0] ? release.tracks[0].title : release.release_title}
                                                        </td>
                                                        <td className="px-3 py-3 border-0 text-secondary">{release.upc || '-'}</td>
                                                        <td className="px-3 py-3 border-0 text-secondary">{release.tracks && release.tracks[0] ? release.tracks[0].isrc : '-'}</td>
                                                        <td className="px-3 py-3 border-0 text-secondary">{release.primary_artist?.name || '-'}</td>
                                                        <td className="px-3 py-3 border-0 text-secondary">{release.label?.name || '-'}</td>
                                                        <td className="px-3 py-3 border-0 text-center">
                                                            <span className="badge bgRed clWhite" style={{ display: "inline-block", fontSize: "10px", padding: "5px" }} >Pending</span>
                                                        </td>
                                                        <td className="px-3 py-3 border-0 text-secondary">
                                                            {release.release_date ? new Date(release.release_date).toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '-'}
                                                        </td>
                                                        <td className="px-3 py-3 border-0 text-center">
                                                            <Link to={`/review-release/${id}`} state={{ from: '/review' }} className="mainBtn bgPurple clWhite">
                                                                View
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="10" className="text-center py-4 text-muted border-0">No pending releases found</td>
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
        </>
    )
}

export default ReviewComponent;
