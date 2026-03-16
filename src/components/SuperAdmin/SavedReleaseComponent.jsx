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
                                <table className="table bg-white align-middle" style={{ border: '1px solid #eee' }}>
                                    <thead>
                                        <tr style={{ color: '#555', fontSize: '13px', borderBottom: '2px solid #eee' }}>
                                            <th className="px-3 py-3 fw-medium border-0 border-end">Type <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px', color: '#ccc' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0 border-end">Title <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px', color: '#ccc' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0 border-end">Artist <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px', color: '#ccc' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0 border-end">Label <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px', color: '#ccc' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0 border-end">Release Date <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px', color: '#ccc' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0 border-end"># Of Tracks <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px', color: '#ccc' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0 border-end">UPC / Catalogue <i className="fa-solid fa-arrows-up-down ms-1" style={{ fontSize: '11px', color: '#ccc' }}></i></th>
                                            <th className="px-3 py-3 fw-medium border-0 border-end">Comment</th>
                                            <th className="px-3 py-3 fw-medium border-0">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {releases.length > 0 ? (
                                            releases.map((release) => (
                                                <tr key={release._id} style={{ borderBottom: '1px solid #eee', fontSize: '14px' }}>
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
                                                        <span title={release.admin_remarks || '-'}>
                                                            {release.admin_remarks || '-'}
                                                        </span>
                                                    </td>
                                                    <td className="px-3 py-3 border-0">
                                                        <button
                                                            className="btn bgPurple clWhite px-3 py-1"
                                                            style={{ fontSize: '12px', borderRadius: '4px' }}
                                                            onClick={() => navigate(`/edit-release/${release._id}`, { state: { from: '/saved-release' } })}
                                                        >
                                                            Continue
                                                        </button>
                                                    </td>
                                                </tr>
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

