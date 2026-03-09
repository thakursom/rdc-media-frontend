import React, { useState, useEffect } from 'react';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";
import { Link } from "react-router-dom";

function RejectedReleaseComponent() {
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        totalDocs: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });
    const [selectedRelease, setSelectedRelease] = useState(null);

    useEffect(() => {
        fetchReleases(pagination.currentPage, searchTerm, pagination.limit);
    }, [pagination.currentPage, searchTerm]);

    const fetchReleases = async (page = 1, search = "", currentLimit = pagination.limit) => {
        setLoading(true);
        try {
            let endpoint = `/releases?page=${page}&limit=${currentLimit}`;
            if (search) endpoint += `&search=${encodeURIComponent(search)}`;

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
                <div className="view-release-sec">
                    <div className="view-release">
                        <div className="view-release-heading">
                            <h6>Rejected Releases</h6>
                        </div>
                        <div className="view-all-release-search">
                            <form onSubmit={handleSearch}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="view_release-search"
                                        placeholder="Search by title/artist/label"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setSearchTerm(val);
                                            if (val === '') {
                                                setPagination(prev => ({ ...prev, currentPage: 1 }));
                                                fetchReleases(1, '');
                                            }
                                        }}
                                    />
                                    <button className="btn bgPurple clWhite" type="submit" style={{ borderRadius: '0 6px 6px 0' }}>
                                        <i className="fa-solid fa-magnifying-glass" />
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="viewReleases-main-sec saved-release">
                        {loading && (
                            <div className="text-center py-5">
                                <Loader message="Fetching rejected releases..." variant="danger" />
                            </div>
                        )}
                        {!loading && (
                            <>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Title / Artist</th>
                                            <th>Label</th>
                                            <th>Release Date</th>
                                            <th># Of tracks</th>
                                            <th>UPC / Catalogue Number</th>
                                            <th />
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {releases.length > 0 ? (
                                            releases.map((release) => (
                                                <tr key={release.id || release._id}>
                                                    <td className="text-color-dark">
                                                        <span>{release.release_type === 1 ? 'Single' : 'Album'}</span>
                                                    </td>
                                                    <td className="Title-artist-td">
                                                        <h6>{release.release_title || 'Untitled'}</h6>
                                                        <p>{release.primary_artist?.name || '-'}</p>
                                                    </td>
                                                    <td>{release.label?.name || '-'}</td>
                                                    <td>{release.release_date ? new Date(release.release_date).toLocaleDateString() : '-'}</td>
                                                    <td>{release.tracks?.length || 0} track{release.tracks?.length !== 1 ? 's' : ''}</td>
                                                    <td>
                                                        <p className="upc-td">
                                                            UPC :<span className="counts">{release.upc || '-'}</span>{" "}
                                                        </p>
                                                        <p className="cat-td">
                                                            Cat# :<span className="cat-count">{release.catalogue_number || '-'}</span>{" "}
                                                        </p>
                                                    </td>
                                                    <td className="excel-button btn-continue">
                                                        <button
                                                            className="mainBtn bgPurple clWhite"
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
                                                <td colSpan="7" className="text-center py-4">No rejected releases found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                            </>
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
                            <h5 className="modal-title" id="reasonModalLabel">Reason for Rejection</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="correction-data">
                                <p>
                                    {selectedRelease?.rejection_reason || selectedRelease?.admin_remarks || "No reason provided by the reviewer. Please review your metadata and audio files carefully."}
                                </p>
                                <div className="correction-btn text-center mt-4">
                                    <Link to={`/edit-release/${selectedRelease?.id || selectedRelease?._id}`} className="mainBtn bgPurple clWhite text-decoration-none" data-bs-dismiss="modal">
                                        Make Correction
                                    </Link>
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
