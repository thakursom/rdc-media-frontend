import React, { useState, useEffect } from 'react';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";
import { useNavigate } from "react-router-dom";

function SavedReleaseComponent() {
    const navigate = useNavigate();
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        totalDocs: 0,
        totalPages: 0,
        currentPage: 1,
    });

    useEffect(() => {
        fetchReleases(pagination.currentPage, pagination.limit);
    }, [pagination.currentPage]);

    const fetchReleases = async (page = 1, currentLimit = pagination.limit) => {
        setLoading(true);
        try {
            let endpoint = `/releases?page=${page}&limit=${currentLimit}`;

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

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handlePerPageChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
        fetchReleases(1, newLimit);
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
                                            {/* <th style={{ minWidth: '140px' }}>Comment</th> */}
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
                                                            <div className="text-muted" style={{ fontSize: '11px' }}>
                                                                {release.primary_artist?.name || '-'}
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
                                                    {/* <td className="text-secondary" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        <span title={release.admin_remarks || '-'}>
                                                            {release.admin_remarks || '-'}
                                                        </span>
                                                    </td> */}
                                                    <td className="text-center">
                                                        <button
                                                            className="mainBtn bgPurple clWhite"
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

