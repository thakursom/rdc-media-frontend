import React, { useState, useEffect } from 'react';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";

function ViewAllReleaseComponent() {
    const [releases, setReleases] = useState([]);
    console.log("releases", releases);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        totalDocs: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });

    useEffect(() => {
        fetchReleases(pagination.currentPage, searchTerm);
    }, [pagination.currentPage]);

    const fetchReleases = async (page = 1, search = "", currentLimit = pagination.limit) => {
        setLoading(true);
        try {
            const endpoint = `/releases?page=${page}&limit=${currentLimit}${search ? `&search=${search}` : ""}`;
            const response = await apiRequest(endpoint, "GET", null, true);
            if (response.success) {
                setReleases(response?.data?.data?.releases || []);
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

    const handleDownloadMeta = (release) => {
        try {
            const dataStr = JSON.stringify(release, null, 2);
            const blob = new Blob([dataStr], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${release.release_title || 'metadata'}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.success("Metadata download started");
        } catch (error) {
            console.error("Download meta error:", error);
            toast.error("Failed to download metadata");
        }
    };

    const handleDownloadAudio = (release) => {
        if (!release.tracks || release.tracks.length === 0) {
            toast.warn("No tracks found for this release");
            return;
        }

        const tracksWithAudio = release.tracks.filter(t => t.audio_path);
        if (tracksWithAudio.length === 0) {
            toast.warn("No audio files available for download");
            return;
        }

        toast.info(`Starting download for ${tracksWithAudio.length} tracks...`);

        tracksWithAudio.forEach((track, index) => {
            // Use setTimeout to avoid browser blocking multiple concurrent downloads
            setTimeout(() => {
                const link = document.createElement("a");
                link.href = track.audio_path;
                link.target = "_blank";
                link.download = track.title || `track-${index + 1}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }, index * 1000);
        });
    };

    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="view-release-sec">
                    <div className="view-release">
                        <div className="view-release-heading">
                            <h6>View Releases</h6>
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
                            <button
                                className="mainBtn bgPurple clWhite"
                                data-bs-toggle="modal"
                                data-bs-target="#advanceFilter"
                            >
                                <i className="fa-solid fa-plus" />
                                Advancesd
                            </button>
                            <div
                                className="modal fade advance-filter-modal"
                                id="advanceFilter"
                                data-bs-keyboard="false"
                                tabIndex={-1}
                                aria-labelledby="staticBackdropLabel"
                                aria-hidden="true"
                            >
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="staticBackdropLabel">
                                                Add Filters
                                            </h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                            >
                                                <i className="fa-solid fa-xmark" />
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="product-info">
                                                <div className="product-info-heading">
                                                    <h6>Product Information</h6>
                                                </div>
                                                <form className="product-list">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="product-mainbox">
                                                                <div className="product-mainbox-content">
                                                                    <div className="product-list-heading">
                                                                        <h6>Status</h6>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="music"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="music"
                                                                        >
                                                                            <span>Music</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="ringtone"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="ringtone"
                                                                        >
                                                                            <span>Ringtone</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="musicVideo"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="musicVideo"
                                                                        >
                                                                            <span>Music Video</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="packshot"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="packshot"
                                                                        >
                                                                            <span>Packshot Video</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="entain"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="entain"
                                                                        >
                                                                            <span>Entertainment Video</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="gaming"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="gaming"
                                                                        >
                                                                            <span>Gaming Video</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group product-field">
                                                                    <label className="form-label" htmlFor="label">
                                                                        Label
                                                                    </label>
                                                                    <input
                                                                        className="font-control"
                                                                        type="text"
                                                                        id="label"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="product-mainbox">
                                                                <div className="product-mainbox-content">
                                                                    <div className="product-list-heading">
                                                                        <h6>Status</h6>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="delivered"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="delivered"
                                                                        >
                                                                            <span>Delivered</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="product-review"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="product-review"
                                                                        >
                                                                            <span>
                                                                                {" "}
                                                                                This product is being reviewed by our content
                                                                                compliance team. In case of compliance issues
                                                                                with stores guidelines, we will contact you
                                                                                for resolution.{" "}
                                                                            </span>{" "}
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="correction"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="correction"
                                                                        >
                                                                            <span>Correction Requested</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="draft"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="draft"
                                                                        >
                                                                            <span>Draft</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="unsellable"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="unsellable"
                                                                        >
                                                                            <span>Unsellable</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group product-field">
                                                                    <label className="form-label" htmlFor="artist">
                                                                        Artist
                                                                    </label>
                                                                    <input
                                                                        className="font-control"
                                                                        type="text"
                                                                        id="artist"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="account-info">
                                                <div className="account-info-heading">
                                                    <h6>Account Information</h6>
                                                </div>
                                                <form className="account-info-form">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group account-field">
                                                                <label className="form-label" htmlFor="user">
                                                                    User
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    id="user"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="period-sec">
                                                <div className="period-sec-heading">
                                                    <h6>Period</h6>
                                                </div>
                                                <form className="period-sec-form">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group account-field label">
                                                                <label className="form-label" htmlFor="preDefined">
                                                                    Pre-Defined Period
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    id="preDefined"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12 period-label account-field label">
                                                            <label className="form-label">Period :</label>
                                                        </div>
                                                        <div className="col-md-6 per-form account-field label">
                                                            <div className="form-group">
                                                                <label className="form-label" htmlFor="periodFrom">
                                                                    From
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    id="periodFrom"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 per-form account-field label">
                                                            <div className="form-group">
                                                                <label className="form-label" htmlFor="periodTo">
                                                                    To
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    id="periodTo"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="source-info">
                                                        <div className="source-info-heading">
                                                            <h6>Source</h6>
                                                        </div>
                                                        <form className="product-list source-list">
                                                            <div className="product-mainbox-content">
                                                                <div className="product-list-check form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="checkbox"
                                                                        name="ar-cheack"
                                                                        defaultValue=""
                                                                        id="digital"
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="digital"
                                                                    >
                                                                        <span>Believe Digital</span>
                                                                    </label>
                                                                </div>
                                                                <div className="product-list-check form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="checkbox"
                                                                        name="ar-cheack"
                                                                        defaultValue=""
                                                                        id="transfer"
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="transfer"
                                                                    >
                                                                        <span>Catalog Transfer</span>
                                                                    </label>
                                                                </div>
                                                                <div className="product-list-check form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="checkbox"
                                                                        name="ar-cheack"
                                                                        defaultValue=""
                                                                        id="upload"
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="upload"
                                                                    >
                                                                        <span>Direct upload on Youtube</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="source-info">
                                                        <div className="source-info-heading">
                                                            <h6>Sort By</h6>
                                                        </div>
                                                        <form className="product-list source-list">
                                                            <div className="product-mainbox-content">
                                                                <div className="product-radio form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="radio"
                                                                        name="ar-cheack"
                                                                        defaultValue=""
                                                                        id="digital"
                                                                    />
                                                                    <label
                                                                        className="form-check-label pro-label"
                                                                        htmlFor="digital"
                                                                    >
                                                                        Release Title
                                                                    </label>
                                                                </div>
                                                                <div className="product-radio form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="radio"
                                                                        name="ar-cheack"
                                                                        defaultValue=""
                                                                        id="transfer"
                                                                    />
                                                                    <label
                                                                        className="form-check-label pro-label"
                                                                        htmlFor="transfer"
                                                                    >
                                                                        <span>Artist</span>
                                                                    </label>
                                                                </div>
                                                                <div className="product-radio form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="radio"
                                                                        name="ar-cheack"
                                                                        defaultValue=""
                                                                        id="upload"
                                                                    />
                                                                    <label
                                                                        className="form-check-label pro-label"
                                                                        htmlFor="upload"
                                                                    >
                                                                        <span>Label</span>
                                                                    </label>
                                                                </div>
                                                                <div className="product-radio form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="radio"
                                                                        name="ar-cheack"
                                                                        defaultValue=""
                                                                        id="upload"
                                                                    />
                                                                    <label
                                                                        className="form-check-label pro-label"
                                                                        htmlFor="upload"
                                                                    >
                                                                        <span>Creation Date</span>
                                                                    </label>
                                                                </div>
                                                                <div className="product-radio form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="radio"
                                                                        name="ar-cheack"
                                                                        defaultValue=""
                                                                        id="upload"
                                                                    />
                                                                    <label
                                                                        className="form-check-label pro-label"
                                                                        htmlFor="upload"
                                                                    >
                                                                        <span>Release Date</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="filter-buttons">
                                                <button className="btn cancel" id="cancelFilter">
                                                    Cancel
                                                </button>
                                                <button className="btn apply" id="applyFilter">
                                                    Apply Filters
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="viewReleases-main-sec">
                        {loading && (
                            <div className="text-center py-5">
                                <Loader message="Fetching releases..." variant="success" />
                            </div>
                        )}
                        {!loading && (
                            <>
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>Type</th>
                                            <th>Status</th>
                                            <th>Title / Artist</th>
                                            <th>Label</th>
                                            <th>Release Date</th>
                                            <th># Of tracks</th>
                                            <th>UPC / Catalogue Number</th>
                                            {/* <th>Promotion</th> */}
                                            <th>Delivered Territories & Store</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {releases.length > 0 ? (
                                            releases.map((release, index) => (
                                                <tr key={release.id || release._id}>
                                                    <td className="text-color-dark">
                                                        <span>{release.release_type === 1 ? 'Single' : 'Album'}</span>
                                                    </td>
                                                    <td>
                                                        <div className="status-ok">
                                                            <img
                                                                src={release.status === 1 ? "../assets/Img/statusOk.png" : "../assets/Img/status.png"}
                                                                alt={release.status === 1 ? "Approved" : "Pending"}
                                                                style={{ width: '20px', height: '20px' }}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="Title-artist-td">
                                                        <h6>{release.release_title}</h6>
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
                                                    {/* <td className="promote-td">Promote</td> */}
                                                    <td className="icon-td">
                                                        <div className="deliever-store-main">
                                                            <div className="iconMain">
                                                                <img src="../assets/Img/earth.png" alt="Region" />
                                                            </div>
                                                            <p>{release.territories?.length || 240} terrs.</p>
                                                        </div>
                                                        <div className="deliever-store-main">
                                                            <div className="iconMain">
                                                                <img src="../assets/Img/file.png" alt="Stores" />
                                                            </div>
                                                            <p>{release.stores?.length || 0} Store.</p>
                                                        </div>
                                                    </td>
                                                    <td className="download-content-btn">
                                                        <button
                                                            className="mainBtn bgPurple clWhite m-2"
                                                            onClick={() => handleDownloadMeta(release)}
                                                        >
                                                            Download Meta
                                                        </button>
                                                        <button
                                                            className="mainBtn bgPurple clWhite m-2"
                                                            onClick={() => handleDownloadAudio(release)}
                                                        >
                                                            Download Audio
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="10" className="text-center py-4">No releases found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>

                                {pagination.totalPages > 1 && (
                                    <div className="pagination-container mt-4">
                                        <CustomPagination
                                            pageCount={pagination.totalPages}
                                            onPageChange={handlePageChange}
                                            currentPage={pagination.currentPage}
                                            perPage={pagination.limit}
                                            onPerPageChange={handlePerPageChange}
                                        />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default ViewAllReleaseComponent;
