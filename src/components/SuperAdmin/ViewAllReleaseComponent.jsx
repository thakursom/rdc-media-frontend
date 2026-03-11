import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";

function ViewAllReleaseComponent() {
    const [releases, setReleases] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [appliedSearchTerm, setAppliedSearchTerm] = useState("");
    const [expandedReleases, setExpandedReleases] = useState([]);
    const [pagination, setPagination] = useState({
        totalDocs: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });

    const toggleReleaseTracks = (id) => {
        setExpandedReleases(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        );
    };

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
        fetchReleases(pagination.currentPage, appliedSearchTerm, pagination.limit, filters);
    }, [pagination.currentPage, appliedSearchTerm, filters]);

    const fetchReleases = async (page = 1, search = "", currentLimit = pagination.limit, currentFilters = filters) => {
        setLoading(true);
        try {
            let endpoint = `/releases?page=${page}&limit=${currentLimit}&create_type=Approved,complete,completed,Complete,Completed,APPROVED,COMPLETE,COMPLETED`;
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
        setAppliedSearchTerm(searchTerm);
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
        setSearchTerm("");
        setAppliedSearchTerm("");
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
                <div className="view-release-sec bg-white p-4" style={{ borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
                    {/* Top Action Bar */}
                    <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                        <div className="d-flex align-items-center gap-2 flex-grow-1" style={{ maxWidth: '600px' }}>
                            <form onSubmit={handleSearch} className="flex-grow-1">
                                <div className="input-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search by Title, ISRC, Artist, Label, UPC..."
                                        value={searchTerm}
                                        onChange={(e) => {
                                            setSearchTerm(e.target.value);
                                        }}
                                        style={{ fontSize: '13px' }}
                                    />
                                    <button className="btn bgPurple clWhite px-4" type="submit" style={{ borderTopRightRadius: '4px', borderBottomRightRadius: '4px', fontSize: '13px' }}>
                                        Search
                                    </button>
                                </div>
                            </form>
                            <button
                                className="btn text-white px-3 whitespace-nowrap"
                                style={{ backgroundColor: '#6c757d', fontSize: '13px', whiteSpace: 'nowrap' }}
                                onClick={handleResetFilters}
                            >
                                Clear Filter
                            </button>
                        </div>

                        {/* <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
                            <button className="btn bgPurple clWhite px-3 py-1" style={{ fontSize: '13px' }}><i className="fa-solid fa-paper-plane me-1"></i> Bulk Resend</button>
                            <button className="btn bgPurple clWhite px-3 py-1" style={{ fontSize: '13px' }}><i className="fa-solid fa-angle-down me-1"></i> Takedown</button>
                            <button className="btn bgPurple clWhite px-3 py-1" style={{ fontSize: '13px' }}><i className="fa-solid fa-pen-to-square me-1"></i> Update</button>
                            <button className="btn bgPurple clWhite px-3 py-1" style={{ fontSize: '13px' }}><i className="fa-solid fa-file-export me-1"></i> Export Selected</button>
                            <button className="btn bgPurple clWhite px-3 py-1" style={{ fontSize: '13px' }}><i className="fa-solid fa-download me-1"></i> PDL</button>
                            <button className="btn bgPurple clWhite px-3 py-1" style={{ fontSize: '13px' }}><i className="fa-solid fa-cloud-arrow-up me-1"></i> FUGGA</button>
                            <button className="btn bgPurple clWhite px-3 py-1" style={{ fontSize: '13px' }}><i className="fa-solid fa-database me-1"></i> Download All</button>
                        </div> */}
                    </div>

                    {/* Filters Bar */}
                    <div className="d-flex align-items-center px-3 py-2 border rounded mb-4 bg-light">
                        <span className="fw-bold me-3 text-secondary" style={{ fontSize: '13px' }}>FILTERS:</span>
                        <button
                            className="btn bgPurple clWhite px-3 py-1"
                            style={{ fontSize: '13px', borderRadius: '4px' }}
                            data-bs-toggle="modal"
                            data-bs-target="#advanceFilter"
                            onClick={() => setTempFilters({ ...filters })}
                            type="button"
                        >
                            <i className="fa-solid fa-filter me-1" /> Add Filter
                        </button>
                    </div>

                    {/* Advance Filter Modal */}
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
                    </div> {/* End modal */}

                    <div className="viewReleases-main-sec mt-4">
                        {loading && (
                            <div className="text-center py-5">
                                <Loader message="Fetching releases..." variant="success" />
                            </div>
                        )}
                        {!loading && (
                            <>
                                <table className="table table-bordered align-middle">
                                    <thead className="table-light">
                                        <tr style={{ color: '#555', fontSize: '13px' }}>
                                            <th style={{ width: '40px' }}><input type="checkbox" className="form-check-input" /></th>
                                            <th>Type</th>
                                            <th>Title</th>
                                            <th>Label</th>
                                            <th>Release Date</th>
                                            <th>Batch ID</th>
                                            <th>Ingestion Date</th>
                                            <th>#Track</th>
                                            <th>UPC</th>
                                            <th>Delivered Territories & Store</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {releases.length > 0 ? (
                                            releases.map((release, index) => {
                                                const id = release.id || release._id;
                                                const isExp = expandedReleases.includes(id);
                                                return (
                                                    <React.Fragment key={id}>
                                                        <tr style={{ backgroundColor: isExp ? '#fdfdfd' : 'transparent', borderBottom: isExp ? 'none' : '1px solid #eff2f7' }}>
                                                            <td><input type="checkbox" className="form-check-input" /></td>
                                                            <td className="text-secondary" style={{ fontSize: '14px' }}>
                                                                {release.release_type === 1 ? 'Single' : 'Album'}
                                                            </td>
                                                            <td>
                                                                <div className="d-flex align-items-center gap-2">
                                                                    <span
                                                                        onClick={() => toggleReleaseTracks(id)}
                                                                        style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '20px', height: '20px' }}
                                                                    >
                                                                        <i className={`fa-solid fa-angle-${isExp ? 'up' : 'down'} text-secondary`} style={{ fontSize: '12px' }}></i>
                                                                    </span>
                                                                    <div>
                                                                        <Link to={`/view-release/${id}`} className="fw-medium text-dark text-decoration-none" style={{ fontSize: '14px' }}>
                                                                            {release.release_title}
                                                                        </Link>
                                                                        <div className="text-muted" style={{ fontSize: '12px' }}>{release.primary_artist?.name || '-'}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td style={{ fontSize: '14px' }}>{release.label?.name || '-'}</td>
                                                            <td style={{ fontSize: '14px' }}>{release.release_date ? new Date(release.release_date).toLocaleDateString('en-CA') : '-'}</td>
                                                            <td style={{ fontSize: '14px', color: '#888' }}>-</td>
                                                            <td style={{ fontSize: '14px', color: '#888' }}>{release.createdAt ? new Date(release.createdAt).toLocaleDateString('en-CA') : '-'}</td>
                                                            <td style={{ fontSize: '14px' }}>{release.tracks?.length || 0}</td>
                                                            <td style={{ fontSize: '14px', color: '#888' }}>{release.upc || '-'}</td>
                                                            <td>
                                                                <div className="d-flex flex-column gap-1" style={{ fontSize: '12px', color: '#555' }}>
                                                                    <div className="d-flex align-items-center gap-2 border rounded px-2 py-1 bg-light">
                                                                        <img src="../assets/Img/earth.png" alt="Region" style={{ width: '14px' }} />
                                                                        <span>Worldwide</span>
                                                                    </div>
                                                                    <div className="d-flex align-items-center gap-2 border rounded px-2 py-1 bg-light">
                                                                        <img src="../assets/Img/file.png" alt="Stores" style={{ width: '14px' }} />
                                                                        <span>{release.stores?.length || 1}</span>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <Link to={`/view-release/${id}`} className="btn bgPurple clWhite px-3 py-1 fw-medium" style={{ fontSize: '13px', borderRadius: '4px' }}>
                                                                    View
                                                                </Link>
                                                            </td>
                                                        </tr>

                                                        {/* Expanded Inner Table */}
                                                        {isExp && (
                                                            <tr style={{ borderTop: 'none', backgroundColor: '#fdfdfd' }}>
                                                                <td colSpan="11" className="p-0 border-0">
                                                                    <div className="px-4 py-3" style={{ borderLeft: '3px solid var(--purple-color, #0066b2)' }}>
                                                                        <table className="table table-sm table-borderless mb-0">
                                                                            <thead>
                                                                                <tr style={{ fontSize: '13px', color: '#333', borderBottom: '2px solid #eee' }}>
                                                                                    <th className="fw-medium pb-2">Track Title</th>
                                                                                    <th className="fw-medium pb-2">Artists</th>
                                                                                    <th className="fw-medium pb-2">Composer</th>
                                                                                    <th className="fw-medium pb-2">Producer</th>
                                                                                    <th className="fw-medium pb-2">Lyricist</th>
                                                                                    <th className="fw-medium pb-2">ISRC</th>
                                                                                    <th className="fw-medium pb-2 text-end pe-4">Promote</th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody>
                                                                                {release.tracks && release.tracks.length > 0 ? (
                                                                                    release.tracks.map((track, tIndex) => (
                                                                                        <tr key={tIndex} style={{ borderBottom: '1px solid #f3f3f3' }}>
                                                                                            <td className="py-2" style={{ fontSize: '13px', color: '#666' }}>{track.title || '-'}</td>
                                                                                            <td className="py-2" style={{ fontSize: '13px', color: '#666' }}>{track.artist || track.author || release.primary_artist?.name || '-'}</td>
                                                                                            <td className="py-2" style={{ fontSize: '13px', color: '#666' }}>{track.composer || '-'}</td>
                                                                                            <td className="py-2" style={{ fontSize: '13px', color: '#666' }}>{track.producer || '-'}</td>
                                                                                            <td className="py-2" style={{ fontSize: '13px', color: '#666' }}>{track.lyricist || '-'}</td>
                                                                                            <td className="py-2" style={{ fontSize: '13px', color: '#666' }}>{track.isrc || '-'}</td>
                                                                                            <td className="py-2 text-end pe-3">
                                                                                                <button className="btn btn-sm bgPurple clWhite px-2 py-1" style={{ fontSize: '11px', borderRadius: '4px' }}>
                                                                                                    <i className="fa-solid fa-bullhorn me-1"></i> Promo
                                                                                                </button>
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))
                                                                                ) : (
                                                                                    <tr>
                                                                                        <td colSpan="7" className="text-muted py-3" style={{ fontSize: '13px' }}>No track data available.</td>
                                                                                    </tr>
                                                                                )}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td colSpan="11" className="text-center py-5 text-muted">No releases found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </>
                        )}
                    </div>

                    {!loading && pagination.totalPages > 0 && (
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
            </section >
        </>
    );
}

export default ViewAllReleaseComponent;
