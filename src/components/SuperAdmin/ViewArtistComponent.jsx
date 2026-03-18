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
            const response = await apiRequest(`/delete-artist/${selectedArtist._id}`, "DELETE", null, true);
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

    const renderToggle = (val) => (
        val === 1
            ? <span style={{ color: '#198754', fontWeight: '500' }}>Enabled</span>
            : <span style={{ color: '#dc3545', fontWeight: '500' }}>Disabled</span>
    );

    const socialIconStyle = (bgColor) => ({
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '32px',
        height: '32px',
        borderRadius: '4px',
        backgroundColor: bgColor,
        color: '#fff',
        fontSize: '16px',
        textDecoration: 'none'
    });

    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="view-release-sec scroll-x-hidden">
                    <div className="view-release d-flex justify-content-between align-items-center">
                        <div className="view-release-heading">
                            <h6 className='clPurple'>View Artist</h6>
                        </div>
                        <div className="manage-genre-btn d-flex align-items-center gap-2">
                            <form className="d-flex" onSubmit={handleSearch}>
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
                                    <button className="btn bgPurple clWhite" type="submit">
                                        <i className="fa-solid fa-magnifying-glass"></i>
                                    </button>
                                </div>
                            </form>
                            <button
                                type="button"
                                className="mainBtn bgPurple clWhite"
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
                                        <th style={{ width: "15%" }}>Artist Name</th>
                                        <th style={{ width: "20%" }}>Email Address</th>
                                        <th style={{ width: "15%" }}>Spotify</th>
                                        <th style={{ width: "15%" }}>Apple</th>
                                        <th style={{ width: "15%" }}>Socials</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {artists.length > 0 ? (
                                        artists.map((artist, index) => (
                                            <tr key={artist._id}>
                                                <td>{((pagination.currentPage - 1) * pagination.limit) + index + 1}</td>
                                                <td className="text-color-dark font-weight-bold">
                                                    <span
                                                        className='clPurple'
                                                        onClick={() => navigate(`/view-artist/${artist._id}`)}
                                                        title="Click to view artist details"
                                                    >
                                                        {artist.name}
                                                    </span>
                                                </td>
                                                <td style={{ fontSize: '0.9rem', color: '#6c757d' }}>{artist.email || '-'}</td>
                                                <td>
                                                    <div className="d-flex flex-column gap-1">
                                                        <span style={{ fontSize: '12px', color: '#6c757d' }}>Status: {renderToggle(artist.is_on_spotify)}</span>
                                                        {artist.spotify_link && (
                                                            <a href={artist.spotify_link} target="_blank" rel="noreferrer" className="text-primary small text-decoration-none">
                                                                Spotify Link
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-column gap-1">
                                                        <span style={{ fontSize: '12px', color: '#6c757d' }}>Status: {renderToggle(artist.is_on_apple)}</span>
                                                        {artist.apple_link && (
                                                            <a href={artist.apple_link} target="_blank" rel="noreferrer" className="text-primary small text-decoration-none">
                                                                Apple Link
                                                            </a>
                                                        )}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-wrap gap-2">
                                                        {artist.sound_cloud && <a href={artist.sound_cloud} style={socialIconStyle('#ff5500')} title="SoundCloud" target="_blank" rel="noreferrer"><i className="fa-brands fa-soundcloud"></i></a>}
                                                        {artist.twitter && <a href={artist.twitter} style={socialIconStyle('#1da1f2')} title="Twitter" target="_blank" rel="noreferrer"><i className="fa-brands fa-twitter"></i></a>}
                                                        {artist.facebook && <a href={artist.facebook} style={socialIconStyle('#1877f2')} title="Facebook" target="_blank" rel="noreferrer"><i className="fa-brands fa-facebook"></i></a>}
                                                        {artist.instagram && <a href={artist.instagram} style={socialIconStyle('#e4405f')} title="Instagram" target="_blank" rel="noreferrer"><i className="fa-brands fa-instagram"></i></a>}
                                                        {artist.youtube && <a href={artist.youtube} style={socialIconStyle('#ff0000')} title="YouTube" target="_blank" rel="noreferrer"><i className="fa-brands fa-youtube"></i></a>}
                                                        {!artist.sound_cloud && !artist.twitter && !artist.facebook && !artist.instagram && !artist.youtube && "-"}
                                                    </div>
                                                </td>
                                                <td className="view-artist-button">
                                                    <div className="d-flex gap-2">
                                                        <button
                                                            type="button"
                                                            className="mainBtn bgPurple clWhite"
                                                            onClick={() => navigate(`/view-artist/${artist._id}`)}
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="mainBtn bgPurple clWhite"
                                                            onClick={() => navigate(`/edit-artist/${artist._id}`)}
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="mainBtn bgRed clWhite"
                                                            onClick={() => openDeleteModal(artist)}
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
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

                    {!loading && pagination.totalPages > 1 && (
                        <div className="mt-4">
                            <CustomPagination
                                pageCount={pagination.totalPages}
                                onPageChange={handlePageChange}
                                currentPage={pagination.currentPage}
                                perPage={pagination.limit}
                                onPerPageChange={handlePerPageChange}
                            />
                        </div>
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
                                <button type="button" className="btn-close" onClick={closeDeleteModal}><i className="fa-solid fa-xmark"></i></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete the artist <strong>{selectedArtist?.name}</strong>? This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="mainBtn bgGray clWhite" onClick={closeDeleteModal}>Cancel</button>
                                <button
                                    type="button"
                                    className="mainBtn bgRed clWhite"
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
