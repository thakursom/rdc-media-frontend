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
        label: "",
        artist: "",
        periodFrom: "",
        periodTo: "",
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
            let endpoint = `/releases?page=${page}&limit=${currentLimit}&create_type=Approved`;
            if (search) endpoint += `&search=${encodeURIComponent(search)}`;

            // Append advanced filters
            if (currentFilters.releaseTypes.length > 0) {
                currentFilters.releaseTypes.forEach(t => endpoint += `&releaseTypes=${t}`);
            }
            if (currentFilters.label) endpoint += `&label=${encodeURIComponent(currentFilters.label)}`;
            if (currentFilters.artist) endpoint += `&artist=${encodeURIComponent(currentFilters.artist)}`;
            if (currentFilters.periodFrom) endpoint += `&periodFrom=${currentFilters.periodFrom}`;
            if (currentFilters.periodTo) endpoint += `&periodTo=${currentFilters.periodTo}`;
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
        if (modalElement) {
            if (window.bootstrap && window.bootstrap.Modal) {
                const modal = window.bootstrap.Modal.getInstance(modalElement) || new window.bootstrap.Modal(modalElement);
                if (modal) modal.hide();
            } else {
                // Fallback to manual trigger if bootstrap is not on window
                const closeBtn = modalElement.querySelector('[data-bs-dismiss="modal"]');
                if (closeBtn) closeBtn.click();
            }
        }
    };

    const handleResetFilters = () => {
        const resetFilters = {
            releaseTypes: [],
            label: "",
            artist: "",
            periodFrom: "",
            periodTo: "",
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

    const [selectedTrack, setSelectedTrack] = useState(null);
    const [availableEvents, setAvailableEvents] = useState([]);
    const [selectedEventIds, setSelectedEventIds] = useState([]);
    const [submittingAssignment, setSubmittingAssignment] = useState(false);

    const handleOpenAssignModal = async (track, releaseId) => {
        setSelectedTrack({ ...track, releaseId });

        // Pre-select existing event IDs if available
        const existingEventIds = track.assignedEvents ? track.assignedEvents.map(a => a.eventId) : [];

        setSelectedEventIds(existingEventIds);

        try {
            const response = await apiRequest('/events?status=Active&limit=100', "GET", null, true);
            if (response.success) {
                setAvailableEvents(response.data.data || []);
            } else {
                toast.error("Failed to fetch active events");
            }
        } catch (error) {
            console.error("Fetch events error:", error);
            toast.error("An error occurred while fetching events");
        }
    };

    const handleEventToggle = (eventId) => {
        setSelectedEventIds(prev =>
            prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]
        );
    };

    const handleAssignSubmit = async () => {
        if (!selectedTrack) return;
        if (selectedEventIds.length === 0) {
            toast.warn("Please select at least one event");
            return;
        }

        setSubmittingAssignment(true);
        try {
            const payload = {
                trackId: selectedTrack._id,
                releaseId: selectedTrack.releaseId,
                eventIds: selectedEventIds
            };
            const response = await apiRequest('/assign-events', "POST", payload, true);
            if (response.success) {
                toast.success(response.data?.message || "Events assigned successfully");
                // Close modal using data-bs-dismiss trigger or check window.bootstrap
                const modalElement = document.getElementById('assignEventsModal');
                if (window.bootstrap && window.bootstrap.Modal) {
                    const modal = window.bootstrap.Modal.getInstance(modalElement);
                    if (modal) modal.hide();
                } else {
                    // Fallback to manual trigger
                    const closeBtn = modalElement?.querySelector('[data-bs-dismiss="modal"]');
                    if (closeBtn) closeBtn.click();
                }
            } else {
                toast.error(response.data?.message || "Failed to assign events");
            }
        } catch (error) {
            console.error("Assign events error:", error);
            toast.error("An error occurred while assigning events");
        } finally {
            setSubmittingAssignment(false);
        }
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
                                    <button className="btn bgPurple clWhite px-4" type="submit" style={{ borderTopRightRadius: '4px', borderBottomRightRadius: '4px', fontSize: '15px' }}>
                                        Search
                                    </button>
                                </div>
                            </form>
                            <button
                                className="mainBtn bgGray clWhite"
                                onClick={handleResetFilters}
                            >
                                Clear Filter
                            </button>
                        </div>
                        {/* 
                        <div className="d-flex align-items-center gap-2 flex-wrap justify-content-end">
                            <button className="mainBtn bgPurple clWhite" style={{ fontSize: '13px' }}><i className="fa-solid fa-paper-plane me-1"></i> Bulk Resend</button>
                            <button className="mainBtn bgPurple clWhite" style={{ fontSize: '13px' }}><i className="fa-solid fa-angle-down me-1"></i> Takedown</button>
                            <button className="mainBtn bgPurple clWhite" style={{ fontSize: '13px' }}><i className="fa-solid fa-pen-to-square me-1"></i> Update</button>
                            <button className="mainBtn bgPurple clWhite" style={{ fontSize: '13px' }}><i className="fa-solid fa-file-export me-1"></i> Export Selected</button>
                            <button className="mainBtn bgPurple clWhite" style={{ fontSize: '13px' }}><i className="fa-solid fa-download me-1"></i> PDL</button>
                            <button className="mainBtn bgPurple clWhite" style={{ fontSize: '13px' }}><i className="fa-solid fa-cloud-arrow-up me-1"></i> FUGGA</button>
                            <button className="mainBtn bgPurple clWhite" style={{ fontSize: '13px' }}><i className="fa-solid fa-database me-1"></i> Download All</button>
                        </div> */}
                    </div>

                    {/* Filters Bar */}
                    <div className="d-flex align-items-center px-3 py-2 border rounded mb-4 bg-light">
                        <span className="fw-bold me-3 text-secondary" style={{ fontSize: '13px' }}>FILTERS:</span>
                        <button
                            className="mainBtn bgPurple clWhite"
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
                        <div className="modal-dialog modal-lg modal-dialog-centered">
                            <div className="modal-content shadow-lg border-0">
                                <div className="modal-header bg-light border-bottom-0 py-3">
                                    <h5 className="modal-title fw-bold clPurple" id="staticBackdropLabel">
                                        <i className="fa-solid fa-filter me-2"></i> Refine Search Filters
                                    </h5>
                                    <button
                                        type="button"
                                        className="btn-close shadow-none"
                                        data-bs-dismiss="modal"
                                        aria-label="Close"
                                    ><i className="fa-solid fa-xmark"></i></button>
                                </div>
                                <div className="modal-body p-4">
                                    <div className="row g-4">
                                        {/* Product Information Section */}
                                        <div className="col-lg-7">
                                            <div className="filter-section p-3 border rounded h-100 bg-white shadow-sm">
                                                <h6 className="fw-bold mb-3 clPurple border-bottom pb-2">
                                                    <i className="fa-solid fa-compact-disc me-2"></i> Product Information
                                                </h6>
                                                <div className="row">
                                                    <div className="col-md-12 mb-3">
                                                        <label className="form-label fw-medium small mb-2">Release Type</label>
                                                        <div className="d-flex gap-3">
                                                            <div className="form-check custom-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id="typeSingle"
                                                                    checked={tempFilters.releaseTypes.includes('single')}
                                                                    onChange={() => handleFilterChange('releaseTypes', 'single', true)}
                                                                    style={{ accentColor: '#0066b2', cursor: 'pointer' }}
                                                                />
                                                                <label className="form-check-label small" htmlFor="typeSingle" style={{ cursor: 'pointer' }}>Single</label>
                                                            </div>
                                                            <div className="form-check custom-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    id="typeAlbum"
                                                                    checked={tempFilters.releaseTypes.includes('album')}
                                                                    onChange={() => handleFilterChange('releaseTypes', 'album', true)}
                                                                    style={{ accentColor: '#0066b2', cursor: 'pointer' }}
                                                                />
                                                                <label className="form-check-label small" htmlFor="typeAlbum" style={{ cursor: 'pointer' }}>Album</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label fw-medium small mb-1" htmlFor="label">Label</label>
                                                        <input
                                                            className="form-control form-control-sm"
                                                            type="text"
                                                            id="label"
                                                            placeholder="Enter label name"
                                                            value={tempFilters.label}
                                                            onChange={(e) => handleFilterChange('label', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-md-6 mb-3">
                                                        <label className="form-label fw-medium small mb-1" htmlFor="artist">Artist</label>
                                                        <input
                                                            className="form-control form-control-sm"
                                                            type="text"
                                                            id="artist"
                                                            placeholder="Enter artist name"
                                                            value={tempFilters.artist}
                                                            onChange={(e) => handleFilterChange('artist', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Period Section */}
                                        <div className="col-lg-5">
                                            <div className="filter-section p-3 border rounded h-100 bg-white shadow-sm">
                                                <h6 className="fw-bold mb-3 clPurple border-bottom pb-2">
                                                    <i className="fa-solid fa-calendar-days me-2"></i> Select Period
                                                </h6>
                                                <div className="row g-2">
                                                    <div className="col-12 mb-2">
                                                        <label className="form-label fw-medium small mb-1" htmlFor="periodFrom">From Date</label>
                                                        <input
                                                            className="form-control form-control-sm"
                                                            type="date"
                                                            id="periodFrom"
                                                            value={tempFilters.periodFrom}
                                                            onChange={(e) => handleFilterChange('periodFrom', e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="col-12">
                                                        <label className="form-label fw-medium small mb-1" htmlFor="periodTo">To Date</label>
                                                        <input
                                                            className="form-control form-control-sm"
                                                            type="date"
                                                            id="periodTo"
                                                            value={tempFilters.periodTo}
                                                            onChange={(e) => handleFilterChange('periodTo', e.target.value)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Sorting Section */}
                                        <div className="col-12">
                                            <div className="filter-section p-3 border rounded bg-white shadow-sm">
                                                <h6 className="fw-bold mb-3 clPurple border-bottom pb-2">
                                                    <i className="fa-solid fa-sort me-2"></i> Sorting Options
                                                </h6>
                                                <div className="row">
                                                    <div className="col-md-8">
                                                        <label className="form-label fw-medium small mb-2">Sort By Field</label>
                                                        <div className="d-flex flex-wrap gap-x-4 gap-y-2">
                                                            {[
                                                                { id: 'sortTitle', val: 'release_title', label: 'Release Title' },
                                                                { id: 'sortArtist', val: 'artist', label: 'Artist' },
                                                                { id: 'sortLabel', val: 'label', label: 'Label' },
                                                                { id: 'sortCreation', val: 'creation_date', label: 'Creation Date' },
                                                                { id: 'sortRelease', val: 'release_date', label: 'Release Date' }
                                                            ].map(item => (
                                                                <div className="form-check me-3" key={item.id}>
                                                                    <input
                                                                        className="form-check-input"
                                                                        type="radio"
                                                                        name="sortBy"
                                                                        id={item.id}
                                                                        checked={tempFilters.sortBy === item.val}
                                                                        onChange={() => handleFilterChange('sortBy', item.val)}
                                                                        style={{ accentColor: '#0066b2', cursor: 'pointer' }}
                                                                    />
                                                                    <label className="form-check-label small" htmlFor={item.id} style={{ cursor: 'pointer' }}>{item.label}</label>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="col-md-4 border-start">
                                                        <label className="form-label fw-medium small mb-2 ms-md-2">Order</label>
                                                        <div className="d-flex flex-column gap-2 ms-md-2">
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="sortOrder"
                                                                    id="sortDesc"
                                                                    checked={tempFilters.sortOrder === 'desc'}
                                                                    onChange={() => handleFilterChange('sortOrder', 'desc')}
                                                                    style={{ accentColor: '#0066b2', cursor: 'pointer' }}
                                                                />
                                                                <label className="form-check-label small" htmlFor="sortDesc" style={{ cursor: 'pointer' }}>Descending (Newest First)</label>
                                                            </div>
                                                            <div className="form-check">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="radio"
                                                                    name="sortOrder"
                                                                    id="sortAsc"
                                                                    checked={tempFilters.sortOrder === 'asc'}
                                                                    onChange={() => handleFilterChange('sortOrder', 'asc')}
                                                                    style={{ accentColor: '#0066b2', cursor: 'pointer' }}
                                                                />
                                                                <label className="form-check-label small" htmlFor="sortAsc" style={{ cursor: 'pointer' }}>Ascending (Oldest First)</label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="modal-footer bg-light border-top-0 p-3">
                                    <button
                                        className="mainBtn bgRed clWhite border-0 px-4 py-2"
                                        type="button"
                                        onClick={handleResetFilters}
                                        style={{ fontSize: '14px', borderRadius: '6px' }}
                                    >
                                        <i className="fa-solid fa-rotate-left me-1"></i> Reset
                                    </button>
                                    <button
                                        className="mainBtn bgPurple clWhite border-0 px-4 py-2"
                                        type="button"
                                        onClick={handleApplyFilters}
                                        style={{ fontSize: '14px', borderRadius: '6px' }}
                                    >
                                        <i className="fa-solid fa-check me-1"></i> Apply Filters
                                    </button>
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
                                                const id = release._id;
                                                const isExp = expandedReleases.includes(id);
                                                return (
                                                    <React.Fragment key={id}>
                                                        <tr style={{ backgroundColor: isExp ? '#fdfdfd' : 'transparent', borderBottom: isExp ? 'none' : '1px solid #eff2f7' }}>
                                                            <td><input type="checkbox" className="form-check-input" /></td>
                                                            <td className="text-secondary" style={{ fontSize: '12px' }}>
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
                                                                        <Link to={`/view-release/${id}`} className="clPurple" style={{ fontSize: '12px' }}>
                                                                            {release.release_title}
                                                                        </Link>
                                                                        <div className="text-muted" style={{ fontSize: '12px' }}>{release.primary_artist?.name || '-'}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td style={{ fontSize: '12px' }}>{release.label?.name || '-'}</td>
                                                            <td style={{ fontSize: '12px' }}>{release.release_date ? new Date(release.release_date).toLocaleDateString('en-CA') : '-'}</td>
                                                            <td style={{ fontSize: '12px', color: '#888' }}>-</td>
                                                            <td style={{ fontSize: '12px', color: '#888' }}>{release.createdAt ? new Date(release.createdAt).toLocaleDateString('en-CA') : '-'}</td>
                                                            <td style={{ fontSize: '12px' }}>{release.tracks?.length || 0}</td>
                                                            <td style={{ fontSize: '12px', color: '#888' }}>{release.upc || '-'}</td>
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
                                                                <Link to={`/view-release/${id}`} className="mainBtn bgPurple clWhite">
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
                                                                                                <button className="btn btn-sm bgPurple clWhite px-2 py-1"
                                                                                                    style={{ fontSize: '11px', borderRadius: '4px' }}
                                                                                                    title="Promote"
                                                                                                    data-bs-toggle="modal"
                                                                                                    data-bs-target="#assignEventsModal"
                                                                                                    onClick={() => handleOpenAssignModal(track, release._id)}
                                                                                                >
                                                                                                    <i className="fa-solid fa-bullhorn me-1"></i> Promote
                                                                                                </button>
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))
                                                                                ) : (
                                                                                    <tr>
                                                                                        <td colSpan="8" className="text-muted py-3" style={{ fontSize: '13px' }}>No track data available.</td>
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

                {/* Assign Events Modal */}
                <div className="modal fade" id="assignEventsModal" tabIndex="-1" aria-hidden="true">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header border-0 pb-0">
                                <h5 className="modal-title fw-bold clPurple">Assign Events</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"><i className="fa-solid fa-xmark"></i></button>
                            </div>
                            <div className="modal-body">
                                <p className="text-muted mb-4" style={{ fontSize: '14px' }}>
                                    Assign upcoming events to track: <span className="fw-bold text-dark">{selectedTrack?.title}</span>
                                </p>

                                <div className="table-responsive border rounded">
                                    <table className="table table-hover mb-0">
                                        <thead className="table-light">
                                            <tr>
                                                <th style={{ width: '80px' }}>Select</th>
                                                <th>Title</th>
                                                <th>Date</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {availableEvents.length > 0 ? (
                                                availableEvents.map(event => (
                                                    <tr key={event._id}>
                                                        <td>
                                                            <div className="form-check d-flex justify-content-center">
                                                                <input
                                                                    className="form-check-input"
                                                                    type="checkbox"
                                                                    checked={selectedEventIds.includes(event._id)}
                                                                    onChange={() => handleEventToggle(event._id)}
                                                                />
                                                            </div>
                                                        </td>
                                                        <td style={{ fontSize: '14px' }}>{event.title}</td>
                                                        <td style={{ fontSize: '14px' }}>{new Date(event.eventDate).toLocaleDateString()}</td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="3" className="text-center py-4 text-muted">No active events found. Please create events first.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="modal-footer border-0">
                                <button type="button" className="mainBtn bgGray clWhite" data-bs-dismiss="modal">Close</button>
                                <button
                                    type="button"
                                    className="mainBtn bgPurple clWhite d-flex align-items-center gap-2"
                                    onClick={handleAssignSubmit}
                                    disabled={submittingAssignment}
                                >
                                    {submittingAssignment ? (
                                        <><i className="fa-solid fa-spinner fa-spin"></i> Submitting...</>
                                    ) : (
                                        <><i className="fa-solid fa-check"></i> Submit</>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </>
    );
}

export default ViewAllReleaseComponent;
