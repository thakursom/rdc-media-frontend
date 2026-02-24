import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";

function ViewArtistComponent() {
    const navigate = useNavigate();
    const [artists, setArtists] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedArtist, setSelectedArtist] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        totalDocs: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });

    useEffect(() => {
        fetchArtists(pagination.currentPage, searchTerm);
    }, [pagination.currentPage]);

    const fetchArtists = async (page = 1, search = "", currentLimit = pagination.limit) => {
        setLoading(true);
        try {
            const endpoint = `/artists?page=${page}&limit=${currentLimit}${search ? `&search=${search}` : ""}`;
            const response = await apiRequest(endpoint, "GET", null, true);
            if (response.success) {
                setArtists(response?.data?.data?.artists || []);
                if (response?.data?.data?.pagination) {
                    setPagination(response.data.data.pagination);
                }
            } else {
                toast.error(response?.data?.message || "Failed to fetch artists");
            }
        } catch (error) {
            console.error("Fetch artists error:", error);
            toast.error("An error occurred while fetching artists");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        fetchArtists(1, searchTerm);
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handlePerPageChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
        fetchArtists(1, searchTerm, newLimit);
    };

    const openDeleteModal = (artist) => {
        setSelectedArtist(artist);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setSelectedArtist(null);
        setShowDeleteModal(false);
    };

    const handleDelete = async () => {
        if (!selectedArtist) return;
        setIsDeleting(true);
        try {
            const response = await apiRequest(`/delete-artist/${selectedArtist.id || selectedArtist._id}`, "DELETE", null, true);
            if (response.success) {
                toast.success("Artist deleted successfully");
                closeDeleteModal();
                fetchArtists(pagination.currentPage, searchTerm);
            } else {
                toast.error(response?.data?.message || "Failed to delete artist");
            }
        } catch (error) {
            console.error("Delete artist error:", error);
            toast.error("An error occurred while deleting the artist");
        } finally {
            setIsDeleting(false);
        }
    };

    const renderToggle = (val) => (val === 1 ? <span className="text-success">Yes</span> : <span className="text-danger">No</span>);

    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="view-release-sec scroll-x-hidden">
                    <div className="view-release">
                        <div className="view-release-heading">
                            <h6>View Artist</h6>
                        </div>
                        <div className="manage-genre-btn d-flex align-items-center">
                            <form className="me-3 d-flex" onSubmit={handleSearch}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by name/email"
                                        value={searchTerm}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setSearchTerm(val);
                                            if (val === '') {
                                                setPagination(prev => ({ ...prev, currentPage: 1 }));
                                                fetchArtists(1, '');
                                            }
                                        }}
                                    />
                                    <button className="btn bgGreen clWhite" type="submit">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </button>
                                </div>
                            </form>
                            <button
                                className="btn mangageGenre"
                                onClick={() => navigate('/add-artist')}
                            >
                                <i className="fa-solid fa-plus" />
                                Add New
                            </button>
                        </div>
                    </div>

                    <div className="viewReleases-main-sec view-Artist overflow-auto mt-4">
                        {loading ? (
                            <Loader message="Fetching artists..." variant="success" />
                        ) : (
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>SN</th>
                                        <th style={{ width: "10%" }}>Name</th>
                                        <th style={{ width: "10%" }}>Email</th>
                                        <th>Spotify</th>
                                        <th>Apple</th>
                                        <th>Socials</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {artists.length > 0 ? (
                                        artists.map((artist, index) => (
                                            <tr key={artist.id || artist._id}>
                                                <td>{((pagination.currentPage - 1) * pagination.limit) + index + 1}</td>
                                                <td className="text-color-dark font-weight-bold">{artist.name}</td>
                                                <td>{artist.email || '-'}</td>
                                                <td>
                                                    <div>On: {renderToggle(artist.is_on_spotify)}</div>
                                                    {artist.spotify_link && (
                                                        <a href={artist.spotify_link} target="_blank" rel="noreferrer" className="text-primary small text-truncate d-inline-block" style={{ maxWidth: '150px' }}>
                                                            Link
                                                        </a>
                                                    )}
                                                </td>
                                                <td>
                                                    <div>On: {renderToggle(artist.is_on_apple)}</div>
                                                    {artist.apple_link && (
                                                        <a href={artist.apple_link} target="_blank" rel="noreferrer" className="text-primary small text-truncate d-inline-block" style={{ maxWidth: '150px' }}>
                                                            Link
                                                        </a>
                                                    )}
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {artist.sound_cloud && <a href={artist.sound_cloud} title="SoundCloud" target="_blank" rel="noreferrer"><i className="fa-brands fa-soundcloud text-orange"></i></a>}
                                                        {artist.twitter && <a href={artist.twitter} title="Twitter" target="_blank" rel="noreferrer"><i className="fa-brands fa-twitter text-info"></i></a>}
                                                        {artist.facebook && <a href={artist.facebook} title="Facebook" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook text-primary"></i></a>}
                                                        {artist.instagram && <a href={artist.instagram} title="Instagram" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram text-danger"></i></a>}
                                                        {artist.youtube && <a href={artist.youtube} title="YouTube" target="_blank" rel="noreferrer"><i className="fa-brands fa-youtube text-danger"></i></a>}
                                                    </div>
                                                </td>
                                                <td className="view-artist-button">
                                                    <button
                                                        className="btn edit"
                                                        onClick={() => navigate(`/edit-artist/${artist.id}`)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn delete"
                                                        onClick={() => openDeleteModal(artist)}
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="7" className="text-center py-4">No artists found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
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

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={closeDeleteModal}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete the artist <strong>{selectedArtist?.name}</strong>? This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Artist'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ViewArtistComponent;
