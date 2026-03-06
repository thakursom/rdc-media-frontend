import React, { useState, useEffect } from 'react';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";

function ViewAllReleaseComponent() {
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        totalDocs: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });

    const [filters, setFilters] = useState({
        releaseTypes: [],
        statuses: [],
        label: "",
        artist: "",
        user: "",
        preDefined: "",
        periodFrom: "",
        periodTo: "",
        sources: [],
        sortBy: "creation_date",
        sortOrder: "desc"
    });

    const [tempFilters, setTempFilters] = useState({ ...filters });

    useEffect(() => {
        fetchReleases(pagination.currentPage, searchTerm, pagination.limit, filters);
    }, [pagination.currentPage, searchTerm, filters]);

    const fetchReleases = async (page = 1, search = "", currentLimit = pagination.limit, currentFilters = filters) => {
        setLoading(true);
        try {
            let endpoint = `/releases?page=${page}&limit=${currentLimit}`;
            if (search) endpoint += `&search=${encodeURIComponent(search)}`;

            // Append advanced filters
            if (currentFilters.releaseTypes.length > 0) {
                currentFilters.releaseTypes.forEach(t => endpoint += `&releaseTypes=${t}`);
            }
            if (currentFilters.statuses.length > 0) {
                currentFilters.statuses.forEach(s => endpoint += `&statuses=${s}`);
            }
            if (currentFilters.label) endpoint += `&label=${encodeURIComponent(currentFilters.label)}`;
            if (currentFilters.artist) endpoint += `&artist=${encodeURIComponent(currentFilters.artist)}`;
            if (currentFilters.user) endpoint += `&user=${encodeURIComponent(currentFilters.user)}`;
            if (currentFilters.periodFrom) endpoint += `&startDate=${currentFilters.periodFrom}`;
            if (currentFilters.periodTo) endpoint += `&endDate=${currentFilters.periodTo}`;
            if (currentFilters.sources.length > 0) {
                currentFilters.sources.forEach(s => endpoint += `&source=${s}`);
            }
            if (currentFilters.sortBy) endpoint += `&sortBy=${currentFilters.sortBy}`;
            if (currentFilters.sortOrder) endpoint += `&sortOrder=${currentFilters.sortOrder}`;

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

    const handleFilterChange = (field, value, isCheckbox = false) => {
        if (isCheckbox) {
            setTempFilters(prev => {
                const currentList = prev[field] || [];
                if (currentList.includes(value)) {
                    return { ...prev, [field]: currentList.filter(item => item !== value) };
                } else {
                    return { ...prev, [field]: [...currentList, value] };
                }
            });
        } else {
            setTempFilters(prev => ({ ...prev, [field]: value }));
        }
    };

    const handleApplyFilters = () => {
        setFilters({ ...tempFilters });
        setPagination(prev => ({ ...prev, currentPage: 1 }));
        // Close modal (Bootstrap 5 way)
        const modalElement = document.getElementById('advanceFilter');
        const modal = window.bootstrap?.Modal?.getInstance(modalElement);
        if (modal) modal.hide();
    };

    const handleResetFilters = () => {
        const resetFilters = {
            releaseTypes: [],
            statuses: [],
            label: "",
            artist: "",
            user: "",
            preDefined: "",
            periodFrom: "",
            periodTo: "",
            sources: [],
            sortBy: "creation_date",
            sortOrder: "desc"
        };
        setTempFilters(resetFilters);
        setFilters(resetFilters);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
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
                                onClick={() => setTempFilters({ ...filters })}
                                type="button"
                            >
                                <i className="fa-solid fa-plus" />
                                Advanced
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
                                                                        <h6>Product Type</h6>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            id="typeSingle"
                                                                            checked={tempFilters.releaseTypes.includes('single')}
                                                                            onChange={() => handleFilterChange('releaseTypes', 'single', true)}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="typeSingle">
                                                                            <span>Single</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            id="typeAlbum"
                                                                            checked={tempFilters.releaseTypes.includes('album')}
                                                                            onChange={() => handleFilterChange('releaseTypes', 'album', true)}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="typeAlbum">
                                                                            <span>Album</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group product-field">
                                                                    <label className="form-label" htmlFor="label">
                                                                        Label
                                                                    </label>
                                                                    <input
                                                                        className="form-control"
                                                                        type="text"
                                                                        id="label"
                                                                        value={tempFilters.label}
                                                                        onChange={(e) => handleFilterChange('label', e.target.value)}
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
                                                                            id="product-published"
                                                                            checked={tempFilters.statuses.includes('approved')}
                                                                            onChange={() => handleFilterChange('statuses', 'approved', true)}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="product-published">
                                                                            <span>Approved</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            id="product-review"
                                                                            checked={tempFilters.statuses.includes('processing')}
                                                                            onChange={() => handleFilterChange('statuses', 'processing', true)}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="product-review">
                                                                            <span>Processing</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            id="correction"
                                                                            checked={tempFilters.statuses.includes('correction')}
                                                                            onChange={() => handleFilterChange('statuses', 'correction', true)}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="correction">
                                                                            <span>Correction Requested</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            id="draft"
                                                                            checked={tempFilters.statuses.includes('draft')}
                                                                            onChange={() => handleFilterChange('statuses', 'draft', true)}
                                                                        />
                                                                        <label className="form-check-label" htmlFor="draft">
                                                                            <span>Draft</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group product-field">
                                                                    <label className="form-label" htmlFor="artist">
                                                                        Artist
                                                                    </label>
                                                                    <input
                                                                        className="form-control"
                                                                        type="text"
                                                                        id="artist"
                                                                        value={tempFilters.artist}
                                                                        onChange={(e) => handleFilterChange('artist', e.target.value)}
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
                                                                    value={tempFilters.user}
                                                                    onChange={(e) => handleFilterChange('user', e.target.value)}
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
                                                                    value={tempFilters.preDefined}
                                                                    onChange={(e) => handleFilterChange('preDefined', e.target.value)}
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
                                                                    type="date"
                                                                    id="periodFrom"
                                                                    value={tempFilters.periodFrom}
                                                                    onChange={(e) => handleFilterChange('periodFrom', e.target.value)}
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
                                                                    type="date"
                                                                    id="periodTo"
                                                                    value={tempFilters.periodTo}
                                                                    onChange={(e) => handleFilterChange('periodTo', e.target.value)}
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-4">
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
                                                                        id="digital"
                                                                        checked={tempFilters.sources.includes('digital')}
                                                                        onChange={() => handleFilterChange('sources', 'digital', true)}
                                                                    />
                                                                    <label className="form-check-label" htmlFor="digital">
                                                                        <span>Believe Digital</span>
                                                                    </label>
                                                                </div>
                                                                <div className="product-list-check form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="checkbox"
                                                                        id="transfer"
                                                                        checked={tempFilters.sources.includes('transfer')}
                                                                        onChange={() => handleFilterChange('sources', 'transfer', true)}
                                                                    />
                                                                    <label className="form-check-label" htmlFor="transfer">
                                                                        <span>Catalog Transfer</span>
                                                                    </label>
                                                                </div>
                                                                <div className="product-list-check form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="checkbox"
                                                                        id="upload"
                                                                        checked={tempFilters.sources.includes('upload')}
                                                                        onChange={() => handleFilterChange('sources', 'upload', true)}
                                                                    />
                                                                    <label className="form-check-label" htmlFor="upload">
                                                                        <span>Direct upload on Youtube</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
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
                                                                        name="sortBy"
                                                                        id="sortTitle"
                                                                        checked={tempFilters.sortBy === 'release_title'}
                                                                        onChange={() => handleFilterChange('sortBy', 'release_title')}
                                                                    />
                                                                    <label className="form-check-label pro-label" htmlFor="sortTitle">
                                                                        Release Title
                                                                    </label>
                                                                </div>
                                                                <div className="product-radio form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="radio"
                                                                        name="sortBy"
                                                                        id="sortArtist"
                                                                        checked={tempFilters.sortBy === 'artist'}
                                                                        onChange={() => handleFilterChange('sortBy', 'artist')}
                                                                    />
                                                                    <label className="form-check-label pro-label" htmlFor="sortArtist">
                                                                        <span>Artist</span>
                                                                    </label>
                                                                </div>
                                                                <div className="product-radio form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="radio"
                                                                        name="sortBy"
                                                                        id="sortLabel"
                                                                        checked={tempFilters.sortBy === 'label'}
                                                                        onChange={() => handleFilterChange('sortBy', 'label')}
                                                                    />
                                                                    <label className="form-check-label pro-label" htmlFor="sortLabel">
                                                                        <span>Label</span>
                                                                    </label>
                                                                </div>
                                                                <div className="product-radio form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="radio"
                                                                        name="sortBy"
                                                                        id="sortCreation"
                                                                        checked={tempFilters.sortBy === 'creation_date'}
                                                                        onChange={() => handleFilterChange('sortBy', 'creation_date')}
                                                                    />
                                                                    <label className="form-check-label pro-label" htmlFor="sortCreation">
                                                                        <span>Creation Date</span>
                                                                    </label>
                                                                </div>
                                                                <div className="product-radio form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="radio"
                                                                        name="sortBy"
                                                                        id="sortRelease"
                                                                        checked={tempFilters.sortBy === 'release_date'}
                                                                        onChange={() => handleFilterChange('sortBy', 'release_date')}
                                                                    />
                                                                    <label className="form-check-label pro-label" htmlFor="sortRelease">
                                                                        <span>Release Date</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="source-info">
                                                        <div className="source-info-heading">
                                                            <h6>Order</h6>
                                                        </div>
                                                        <form className="product-list source-list">
                                                            <div className="product-mainbox-content">
                                                                <div className="product-radio form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="radio"
                                                                        name="sortOrder"
                                                                        id="sortDesc"
                                                                        checked={tempFilters.sortOrder === 'desc'}
                                                                        onChange={() => handleFilterChange('sortOrder', 'desc')}
                                                                    />
                                                                    <label className="form-check-label pro-label" htmlFor="sortDesc">
                                                                        <span>Descending</span>
                                                                    </label>
                                                                </div>
                                                                <div className="product-radio form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="radio"
                                                                        name="sortOrder"
                                                                        id="sortAsc"
                                                                        checked={tempFilters.sortOrder === 'asc'}
                                                                        onChange={() => handleFilterChange('sortOrder', 'asc')}
                                                                    />
                                                                    <label className="form-check-label pro-label" htmlFor="sortAsc">
                                                                        <span>Ascending</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="filter-buttons">
                                                <button className="mainBtn bgRed clWhite" type="button" onClick={handleResetFilters}>
                                                    Reset
                                                </button>
                                                <button className="mainBtn bgPurple clWhite" type="button" onClick={handleApplyFilters}>
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
