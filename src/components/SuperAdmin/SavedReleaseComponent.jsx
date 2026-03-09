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

            // Assuming the API supports create_type filtering
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
                <div className="view-release-sec">
                    <div className="view-release">
                        <div className="view-release-heading">
                            <h6>Saved Releases</h6>
                        </div>
                        <div className="view-all-release-search">
                            <form onSubmit={handleSearch}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="view_release-search"
                                        placeholder="Search by releases"
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
                                <Loader message="Fetching saved releases..." variant="success" />
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
                                                            id="saved-release"
                                                            onClick={() => navigate(`/edit-release/${release.id}`)}
                                                        >
                                                            Continue
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center py-4">No saved releases found</td>
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
        </>
    )
}

export default SavedReleaseComponent
