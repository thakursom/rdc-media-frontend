import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest, ROOT_URL } from "../../services/api";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";
import CustomPagination from "../Pagination/CustomPagination";

function ViewNewsletterComponent() {
    const navigate = useNavigate();
    const [newsletters, setNewsletters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedNewsletter, setSelectedNewsletter] = useState(null);

    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        totalDocs: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });

    useEffect(() => {
        fetchNewsletters(pagination.currentPage, searchTerm);
    }, [pagination.currentPage]);

    const fetchNewsletters = async (page = 1, search = "", currentLimit = pagination.limit) => {
        setLoading(true);
        try {
            const endpoint = `/newsletters?page=${page}&limit=${currentLimit}${search ? `&search=${search}` : ""}`;
            const response = await apiRequest(endpoint, "GET", null, true);
            console.log(response);
            if (response.success && response.data && response.data.data && response.data.data.newsletters) {
                setNewsletters(response.data.data.newsletters);
                if (response.data.data.pagination) {
                    setPagination(response.data.data.pagination);
                }
            } else if (response.success && response.data && response.data.newsletters) {
                setNewsletters(response.data.newsletters);
                if (response.data.pagination) {
                    setPagination(response.data.pagination);
                }
            } else {
                toast.error("Failed to fetch newsletters.");
            }
        } catch (error) {
            console.error("Fetch newsletters error:", error);
            toast.error("An error occurred while fetching newsletters.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        fetchNewsletters(1, searchTerm);
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handlePerPageChange = (newLimit) => {
        setPagination(prev => ({ ...prev, limit: newLimit, currentPage: 1 }));
        fetchNewsletters(1, searchTerm, newLimit);
    };

    const openDeleteModal = (newsletter) => {
        setSelectedNewsletter(newsletter);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setSelectedNewsletter(null);
        setShowDeleteModal(false);
    };

    const handleDelete = async () => {
        if (!selectedNewsletter) return;
        setIsDeleting(true);
        try {
            const response = await apiRequest(`/delete-newsletter/${selectedNewsletter._id}`, "DELETE", null, true);
            if (response.success) {
                toast.success("Newsletter deleted successfully.");
                closeDeleteModal();
                fetchNewsletters(pagination.currentPage, searchTerm);
            } else {
                toast.error(response?.data?.message || "Failed to delete newsletter.");
            }
        } catch (error) {
            console.error("Delete newsletter error:", error);
            toast.error("An error occurred while deleting newsletter.");
        } finally {
            setIsDeleting(false);
        }
    };

    const stripHtml = (html) => {
        if (!html) return "";
        const doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || "";
    };



    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="view-release-sec scroll-x-hidden">
                    <div className="view-release">
                        <div className="view-release-heading">
                            <h6 className='clPurple'>View Newsletter</h6>
                        </div>
                        <div className="manage-genre-btn d-flex align-items-center">
                            <form className="me-3 d-flex" onSubmit={handleSearch}>
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by title..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            setSearchTerm(val);
                                            if (val === '') {
                                                setPagination(prev => ({ ...prev, currentPage: 1 }));
                                                fetchNewsletters(1, '');
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
                                onClick={() => navigate('/add-newsletter')}
                            >
                                <i className="fa-solid fa-plus" />
                                Add New
                            </button>
                        </div>
                    </div>
                    <div className="viewReleases-main-sec audio-sec mt-3">
                        {loading ? (
                            <Loader message="Fetching newsletters..." variant="success" />
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered text-center align-middle">
                                    <thead>
                                        <tr>
                                            <th>SN</th>
                                            <th>Title / Artist</th>
                                            <th>Short Description</th>
                                            <th>Image</th>
                                            <th>Status</th>
                                            <th>External Link</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {newsletters.length > 0 ? (
                                            newsletters.map((newsletter, index) => {
                                                let imageUrl = newsletter.image_url;
                                                if (imageUrl && !imageUrl.startsWith('http')) {
                                                    imageUrl = `${ROOT_URL}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
                                                }

                                                return (
                                                    <tr key={newsletter._id}>
                                                        <td>{((pagination.currentPage - 1) * pagination.limit) + index + 1}</td>
                                                        <td className="Title-artist-td">
                                                            <h6 className="mb-0">{newsletter.titleArtist}</h6>
                                                        </td>
                                                        <td className="news-pra">
                                                            <p className="mb-0 text-truncate mx-auto" style={{ maxWidth: '250px' }}>
                                                                {stripHtml(newsletter.shortDescription)}
                                                            </p>
                                                        </td>
                                                        <td>
                                                            <div className="news-sec-image d-flex justify-content-center">
                                                                <img
                                                                    src={imageUrl}
                                                                    alt="Newsletter"
                                                                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = 'https://via.placeholder.com/80?text=No+Image';
                                                                    }}
                                                                />
                                                            </div>
                                                        </td>

                                                        <td>
                                                            <span className={`badge ${newsletter.status === 'Active' ? 'bg-success' : 'bg-secondary'}`}>
                                                                {newsletter.status}
                                                            </span>
                                                        </td>
                                                        <td>
                                                            {newsletter.externalLink ? (
                                                                <a href={newsletter.externalLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                                                                    Visit
                                                                </a>
                                                            ) : (
                                                                <span>-</span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div className="view-artist-button">
                                                                <button
                                                                    type="button"
                                                                    className="mainBtn bgPurple clWhite"
                                                                    onClick={() => navigate(`/edit-newsletter/${newsletter._id}`)}
                                                                >
                                                                    Edit
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="mainBtn bgRed clWhite"
                                                                    onClick={() => openDeleteModal(newsletter)}
                                                                >
                                                                    Delete
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="7" className="text-center py-4">
                                                    No newsletters found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
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
                                <p>Are you sure you want to delete the newsletter <strong>{selectedNewsletter?.titleArtist}</strong>? This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="mainBtn bgGray clWhite" onClick={closeDeleteModal}>Cancel</button>
                                <button
                                    type="button"
                                    className="mainBtn bgRed clWhite"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete Newsletter'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ViewNewsletterComponent;
