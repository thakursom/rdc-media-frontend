import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";

function ViewSingleReleaseComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [release, setRelease] = useState(null);
    const [loading, setLoading] = useState(true);
    const [expandedTracks, setExpandedTracks] = useState([]);
    const [stores, setStores] = useState([]);

    const getStoreNames = (selectedIds) => {
        if (!selectedIds || selectedIds.length === 0) return 'None selected';
        return selectedIds.map(id => {
            const store = stores?.find(s => s._id === id);
            return store ? store.name : id;
        }).join(', ');
    };

    const toggleTrackDetail = (trackIdx) => {
        setExpandedTracks(prev => {
            if (prev.includes(trackIdx)) return prev.filter(idx => idx !== trackIdx);
            return [...prev, trackIdx];
        });
    };

    useEffect(() => {
        fetchReleaseDetails();
        fetchStores();
    }, [id]);

    const fetchStores = async () => {
        try {
            const response = await apiRequest("/release-dsps", "GET", null, true);
            if (response.success && response.data?.data) {
                setStores(response.data.data);
            }
        } catch (error) {
            console.error("Error fetching stores:", error);
        }
    };

    const formatDuration = (duration) => {
        if (!duration) return '0:00';
        if (typeof duration === 'string' && duration.includes(':')) return duration;
        const totalSeconds = Number(duration) || 0;
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const fetchReleaseDetails = async () => {
        setLoading(true);
        try {
            const response = await apiRequest(`/releases/${id}`, "GET", null, true);
            if (response.success && response.data?.data) {
                // Determine if backend returns an array from aggregation or a direct object
                const fetchedRelease = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
                setRelease(fetchedRelease);
            } else {
                toast.error(response?.data?.message || "Failed to fetch release details.");
            }
        } catch (error) {
            console.error("Error fetching release:", error);
            toast.error("Error fetching release details.");
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadMeta = () => {
        if (!release) return;
        const metaData = {
            title: release.release_title,
            artist: release.primary_artist?.name,
            label: release.label?.name,
            upc: release.upc,
            catalogueNumber: release.catalogue_number,
            releaseDate: release.release_date,
            tracks: release.tracks?.map(t => ({
                title: t.title,
                isrc: t.isrc,
                duration: t.duration || "0:00"
            })) || []
        };
        const blob = new Blob([JSON.stringify(metaData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${release.release_title || 'release'}_meta.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <section className="right-sidebar py-5 text-center" id="sidebarRight">
                <Loader message="Loading release details..." variant="success" />
            </section>
        );
    }

    if (!release) {
        return (
            <section className="right-sidebar py-5 text-center" id="sidebarRight">
                <div className="container">
                    <h4>Release not found.</h4>
                    <button className="btn bgPurple clWhite mt-3" onClick={() => navigate('/view-release')}>Back to List</button>
                </div>
            </section>
        );
    }

    return (
        <section className="right-sidebar" id="sidebarRight">
            <div className="view-release-sec views-sec p-4 bg-white" style={{ borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                    <h5 className="mb-0 fw-bold clPurple" style={{ fontSize: '18px' }}>Views</h5>
                    <button className="mainBtn bgPurple clWhite" onClick={() => navigate('/view-release')}>Back</button>
                </div>

                {/* Main Release Card */}
                <div className="card border-0 mb-4 p-3 bg-white">
                    <div className="row">
                        <div className="col-md-4 col-lg-3 text-center mb-3 mb-md-0 d-flex justify-content-center align-items-center">
                            <div className="p-1 border rounded bg-light" style={{ width: '100%', maxWidth: '280px', aspectRatio: '1/1' }}>
                                <img
                                    src={release.artwork_path || "https://via.placeholder.com/300"}
                                    alt="Artwork"
                                    className="img-fluid rounded shadow-sm"
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            </div>
                        </div>
                        <div className="col-md-8 col-lg-9 d-flex flex-column justify-content-center">
                            <h4 className="fw-bold mb-4 clPurple" style={{ fontSize: '22px' }}>{release.release_title || 'N/A'}</h4>

                            <div className="row mb-4">
                                <div className="col-md-4 mb-3">
                                    <span className="text-secondary fw-semibold" style={{ fontSize: '14px' }}>Artist : </span>
                                    <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.primary_artist?.name || 'N/A'}</span>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <span className="text-secondary fw-semibold" style={{ fontSize: '14px' }}>Label : </span>
                                    <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.label?.name || 'N/A'}</span>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <span className="text-secondary fw-semibold" style={{ fontSize: '14px' }}>Genre : </span>
                                    <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.genre_name || 'N/A'}</span>
                                </div>

                                <div className="col-md-4 mb-3">
                                    <span className="text-secondary fw-semibold" style={{ fontSize: '14px' }}>UPC : </span>
                                    <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.upc || 'N/A'}</span>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <span className="text-secondary fw-semibold" style={{ fontSize: '14px' }}>Product Type : </span>
                                    <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>
                                        {typeof release.release_type === 'number'
                                            ? (release.release_type === 1 ? 'single' : 'album')
                                            : (release.release_type || 'N/A')}
                                    </span>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <span className="text-secondary fw-semibold" style={{ fontSize: '14px' }}>Release Date : </span>
                                    <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>
                                        {release.release_date ? new Date(release.release_date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }) : 'N/A'}
                                    </span>
                                </div>

                                <div className="col-md-4 mb-3">
                                    <span className="text-secondary fw-semibold" style={{ fontSize: '14px' }}>Preorder Data : </span>
                                    <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>-</span>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <span className="text-secondary fw-semibold" style={{ fontSize: '14px' }}>Meta Language : </span>
                                    <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.language_name || 'N/A'}</span>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <span className="text-secondary fw-semibold" style={{ fontSize: '14px' }}>Production Year : </span>
                                    <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.p_line_year || 'N/A'}</span>
                                </div>

                                <div className="col-md-4 mb-3">
                                    <span className="text-secondary fw-semibold" style={{ fontSize: '14px' }}>Catalogue Number : </span>
                                    <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.catalogue_number || 'N/A'}</span>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <span className="text-secondary fw-semibold" style={{ fontSize: '14px' }}>© C-Line : </span>
                                    <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.c_line || 'N/A'}</span>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <span className="text-secondary fw-semibold" style={{ fontSize: '14px' }}>C-Line Year : </span>
                                    <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.c_line_year || 'N/A'}</span>
                                </div>

                                <div className="col-md-4 mb-3">
                                    <span className="text-secondary fw-semibold" style={{ fontSize: '14px' }}>℗ P-Line : </span>
                                    <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.p_line || 'N/A'}</span>
                                </div>
                                <div className="col-md-4 mb-3">
                                    <span className="text-secondary fw-semibold" style={{ fontSize: '14px' }}>P-Line Year : </span>
                                    <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{release.p_line_year || 'N/A'}</span>
                                </div>
                                <div className="col-12 mb-3">
                                    <span className="text-secondary fw-semibold" style={{ fontSize: '14px' }}>Selected Stores : </span>
                                    <span className="fw-medium text-dark" style={{ fontSize: '14px' }}>{getStoreNames(release.store_ids)}</span>
                                </div>
                            </div>

                            <div className="d-flex gap-3 mt-2">
                                <button className="mainBtn bgPurple clWhite" onClick={() => navigate(`/edit-release/${release._id}`)}>Edit</button>
                                <button className="mainBtn bgPurple clWhite" onClick={handleDownloadMeta}>Download Meta</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Release DSP Export Details */}
                <div className="d-flex justify-content-between align-items-center p-3 mb-4 rounded shadow-sm" style={{ backgroundColor: '#fdfdfd', border: '1px solid #eaeaea' }}>
                    <div className="d-flex align-items-center gap-2">
                        <i className="fa-solid fa-record-vinyl clPurple"></i>
                        <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>Release DSP Export Details</span>
                    </div>
                    <button className="btn btn-sm btn-outline-secondary clPurple" style={{ backgroundColor: 'transparent', border: '1px solid currentColor', fontSize: '12px' }}>Show Detail</button>
                </div>

                {/* Volume 1 Section */}
                <div className="card border-0 bg-white" style={{ borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
                    <div className="card-header bg-light border-0 d-flex justify-content-between align-items-center py-3 px-4 rounded-top">
                        <h4 className="mb-0 text-dark fw-bold" style={{ fontSize: '20px' }}>Volume 1</h4>
                        <span className="clPurple" style={{ cursor: 'pointer', fontSize: '12px' }}>Show Detail</span>
                    </div>
                    <div className="card-body p-0">
                        {release.tracks && release.tracks.length > 0 ? (
                            <table className="table table-hover mb-0 align-middle">
                                <thead>
                                    <tr style={{ color: '#666', fontSize: '12px', borderBottom: '2px solid #eaeaea' }}>
                                        <th className="px-4 py-3 fw-medium border-0" style={{ width: '25%' }}>Title</th>
                                        <th className="px-2 py-3 fw-medium border-0" style={{ width: '20%' }}>ISRC</th>
                                        <th className="px-2 py-3 fw-medium border-0" style={{ width: '20%' }}>Artist</th>
                                        <th className="px-2 py-3 fw-medium border-0" style={{ width: '10%' }}>Duration</th>
                                        <th className="px-4 py-3 fw-medium border-0 text-end" style={{ width: '25%' }}>Audio File</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {release.tracks.map((track, idx) => {
                                        const isExp = expandedTracks.includes(idx);
                                        return (
                                            <React.Fragment key={idx}>
                                                <tr style={{ borderBottom: isExp ? 'none' : '1px solid #f5f5f5' }}>
                                                    <td className="px-4 py-3 border-0">
                                                        <span className="clPurple fw-medium" style={{ cursor: 'pointer', fontSize: '12px' }} onClick={() => toggleTrackDetail(idx)}>
                                                            {track.title || '-'} {track.mix_version ? `(${track.mix_version})` : ''}
                                                        </span>
                                                    </td>
                                                    <td className="px-2 py-3 border-0" style={{ fontSize: '12px', color: '#777' }}>{track.isrc_number || track.isrc || '-'}</td>
                                                    <td className="px-2 py-3 border-0" style={{ fontSize: '12px', color: '#777' }}>{track.artist || track.author || release.primary_artist?.name || '-'}</td>
                                                    <td className="px-2 py-3 border-0" style={{ fontSize: '12px', color: '#777' }}>{formatDuration(track.duration)}</td>
                                                    <td className="px-4 py-3 border-0 text-end">
                                                        <div className="d-flex align-items-center justify-content-end gap-3">
                                                            {track.audio_path ? (
                                                                <audio controls style={{ height: '35px', width: '200px' }} className="shadow-sm rounded">
                                                                    <source src={(track.preview_start !== undefined && track.preview_start !== null) ? `${track.audio_path}#t=${track.preview_start}` : track.audio_path} type="audio/mpeg" />
                                                                    Your browser does not support the audio element.
                                                                </audio>
                                                            ) : (
                                                                <span className="text-muted" style={{ fontSize: '12px' }}>No audio</span>
                                                            )}
                                                            {track.audio_path && (
                                                                <a href={track.audio_path} download className="btn btn-sm btn-light border shadow-sm clPurple">
                                                                    <i className="fa-solid fa-download"></i>
                                                                </a>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                                {isExp && (
                                                    <tr style={{ backgroundColor: '#fdfdfd', borderBottom: '1px solid #f5f5f5' }}>
                                                        <td colSpan="6" className="px-4 py-3 border-0">
                                                            <div className="d-flex flex-column gap-2 mb-2">
                                                                <h6 className="clPurple mb-1" style={{ fontSize: '12px', fontWeight: 'bold' }}>Roles</h6>
                                                                <div className="d-flex gap-4" style={{ fontSize: '12px', color: '#666' }}>
                                                                    <span>Remixer: {track.remixer || 'Not Provided'}</span>
                                                                    <span>Artists: {track.artist || release.primary_artist?.name || 'Not Provided'}</span>
                                                                    <span>Composer: {track.composer || '-'}</span>
                                                                    <span>Producer: {track.producer || '-'}</span>
                                                                    <span>Lyricist: {track.lyricist || '-'}</span>
                                                                </div>
                                                            </div>
                                                            <div className="d-flex flex-column gap-2">
                                                                <h6 className="clPurple mb-1" style={{ fontSize: '12px', fontWeight: 'bold' }}>Information</h6>
                                                                <div className="d-flex gap-4" style={{ fontSize: '12px', color: '#666' }}>
                                                                    <span>ISRC: {track.isrc || track.isrc_number || 'N/A'}</span>
                                                                    <span>Language: {release.language_name || 'N/A'}</span>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="p-5 text-center text-muted">No tracks available for this release.</div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ViewSingleReleaseComponent;
