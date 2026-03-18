import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiRequest, ROOT_URL } from "../../services/api";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";

function ViewSingleArtistComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [artist, setArtist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        fetchArtistDetails();
    }, [id]);

    const fetchArtistDetails = async () => {
        setLoading(true);
        try {
            const response = await apiRequest(`/artist/${id}`, "GET", null, true);
            if (response.success && response.data?.data) {
                setArtist(response.data.data);
            } else {
                toast.error(response?.data?.message || "Failed to fetch artist details.");
            }
        } catch (error) {
            console.error("Error fetching artist:", error);
            toast.error("Error fetching artist details.");
        } finally {
            setLoading(false);
        }
    };

    const socialIconStyle = (bgColor) => ({
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        backgroundColor: bgColor,
        color: '#fff',
        fontSize: '20px',
        textDecoration: 'none',
        transition: 'transform 0.2s ease',
    });

    if (loading) {
        return (
            <section className="right-sidebar py-5 text-center" id="sidebarRight">
                <Loader message="Loading artist details..." variant="success" />
            </section>
        );
    }

    if (!artist) {
        return (
            <section className="right-sidebar py-5 text-center" id="sidebarRight">
                <div className="container">
                    <div className="card border-0 shadow-sm p-5">
                        <i className="fa-solid fa-user-slash clPurple mb-4" style={{ fontSize: '48px' }}></i>
                        <h4>Artist not found.</h4>
                        <p className="text-muted">The artist you are looking for does not exist or has been removed.</p>
                        <button className="mainBtn bgPurple clWhite mt-3" onClick={() => navigate('/view-artist')}>Back to List</button>
                    </div>
                </div>
            </section>
        );
    }

    const renderStatus = (val) => (
        val === 1
            ? <span className="badge bg-success-subtle text-success px-3 py-2 rounded-pill"><i className="fa-solid fa-circle-check me-1"></i> Enabled</span>
            : <span className="badge bg-danger-subtle text-danger px-3 py-2 rounded-pill"><i className="fa-solid fa-circle-xmark me-1"></i> Disabled</span>
    );

    let displayImageUrl = artist.artist_image_url;
    if (displayImageUrl && !displayImageUrl.startsWith('http')) {
        displayImageUrl = `${ROOT_URL}${displayImageUrl.startsWith('/') ? '' : '/'}${displayImageUrl}`;
    }

    return (
        <section className="right-sidebar" id="sidebarRight">
            <div className="view-release-sec views-sec p-4 bg-white" style={{ borderRadius: '15px', boxShadow: '0 5px 20px rgba(0,0,0,0.05)' }}>
                {/* Header Section */}
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                    <div className="d-flex align-items-center gap-3">
                        <h5 className="mb-0 fw-bold clPurple" style={{ fontSize: '18px' }}>Artist Profile</h5>
                    </div>
                    <div className="d-flex gap-2">
                        <button className="mainBtn bgPurple clWhite" onClick={() => navigate('/view-artist')}>Back</button>
                    </div>
                </div>

                <div className="row g-4">
                    {/* Left Column: Image & Basic Info */}
                    <div className="col-lg-4 col-xl-3">
                        <div className="card border-0 shadow-sm overflow-hidden h-100" style={{ borderRadius: '15px' }}>
                            <div className="position-relative bg-light d-flex align-items-center justify-content-center" style={{ aspectRatio: '1/1', overflow: 'hidden' }}>
                                {(!displayImageUrl || imageError) ? (
                                    <div className="text-center p-4">
                                        <i className="fa-solid fa-user clPurple opacity-50" style={{ fontSize: '100px' }}></i>
                                    </div>
                                ) : (
                                    <img
                                        src={displayImageUrl}
                                        alt={artist.name}
                                        className="img-fluid w-100 h-100"
                                        style={{ objectFit: 'cover' }}
                                        onError={() => setImageError(true)}
                                    />
                                )}
                                <div className="position-absolute bottom-0 start-0 w-100 p-3 bg-dark bg-opacity-75 text-white backdrop-blur">
                                    <h5 className="mb-0 fw-bold" style={{ fontSize: '16px' }}>{artist.name}</h5>
                                    <small className="opacity-75 d-block text-truncate" style={{ fontSize: '12px' }}>{artist.email || 'No email provided'}</small>
                                </div>
                            </div>
                            <div className="card-body">
                                <div className="mb-4">
                                    <label className="text-secondary small fw-bold text-uppercase mb-2 d-block">Platform Status</label>
                                    <div className="d-flex flex-column gap-3 mt-2">
                                        <div className="d-flex justify-content-between align-items-center p-2 rounded bg-light">
                                            <span className="small fw-medium"><i className="fa-brands fa-spotify me-2" style={{ color: '#1DB954' }}></i>Spotify</span>
                                            {renderStatus(artist.is_on_spotify)}
                                        </div>
                                        <div className="d-flex justify-content-between align-items-center p-2 rounded bg-light">
                                            <span className="small fw-medium"><i className="fa-brands fa-apple me-2" style={{ color: '#000' }}></i>Apple Music</span>
                                            {renderStatus(artist.is_on_apple)}
                                        </div>
                                    </div>
                                </div>

                                {artist.isrc && (
                                    <div className="mb-3">
                                        <label className="text-secondary small fw-bold text-uppercase mb-1 d-block">Artist ISRC</label>
                                        <div className="p-2 border rounded text-center fw-mono bg-light">{artist.isrc}</div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Detailed Info & Socials */}
                    <div className="col-lg-8 col-xl-9">
                        <div className="row g-4 mb-5">
                            {/* Platform Links */}
                            <div className="col-12">
                                <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '15px' }}>
                                    <h6 className="fw-bold clPurple mb-4 border-bottom pb-2">
                                        <i className="fa-solid fa-link me-2"></i>Platform Connections
                                    </h6>
                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="text-secondary small fw-bold text-uppercase mb-2 d-block">Spotify Artist Link</label>
                                            {artist.spotify_link ? (
                                                <a href={artist.spotify_link} target="_blank" rel="noreferrer" className="text-decoration-none d-flex align-items-center p-2 border rounded hover-bg-light">
                                                    <i className="fa-brands fa-spotify me-2 fs-5" style={{ color: '#1DB954' }}></i>
                                                    <span className="text-truncate text-primary small">View Spotify Profile</span>
                                                    <i className="fa-solid fa-up-right-from-square ms-auto small text-secondary"></i>
                                                </a>
                                            ) : (
                                                <div className="p-2 border rounded text-muted small bg-light">Not Linked</div>
                                            )}
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="text-secondary small fw-bold text-uppercase mb-2 d-block">Apple Artist Link</label>
                                            {artist.apple_link ? (
                                                <a href={artist.apple_link} target="_blank" rel="noreferrer" className="text-decoration-none d-flex align-items-center p-2 border rounded hover-bg-light">
                                                    <i className="fa-brands fa-apple me-2 fs-5" style={{ color: '#000' }}></i>
                                                    <span className="text-truncate text-primary small">View Apple Profile</span>
                                                    <i className="fa-solid fa-up-right-from-square ms-auto small text-secondary"></i>
                                                </a>
                                            ) : (
                                                <div className="p-2 border rounded text-muted small bg-light">Not Linked</div>
                                            )}
                                        </div>
                                        {artist.youtube_link && (
                                            <div className="col-md-12">
                                                <label className="text-secondary small fw-bold text-uppercase mb-2 d-block">YouTube OAC Link</label>
                                                <a href={artist.youtube_link} target="_blank" rel="noreferrer" className="text-decoration-none d-flex align-items-center p-2 border rounded hover-bg-light">
                                                    <i className="fa-brands fa-youtube me-2 fs-5" style={{ color: '#FF0000' }}></i>
                                                    <span className="text-truncate text-primary small">{artist.youtube_link}</span>
                                                    <i className="fa-solid fa-up-right-from-square ms-auto small text-secondary"></i>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Social Presence */}
                            <div className="col-md-7">
                                <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '15px' }}>
                                    <h6 className="fw-bold clPurple mb-4 border-bottom pb-2">
                                        <i className="fa-solid fa-share-nodes me-2"></i>Social Media
                                    </h6>
                                    <div className="d-flex flex-wrap gap-3">
                                        {artist.sound_cloud ? (
                                            <a href={artist.sound_cloud} style={socialIconStyle('#ff5500')} title="SoundCloud" target="_blank" rel="noreferrer">
                                                <i className="fa-brands fa-soundcloud"></i>
                                            </a>
                                        ) : null}
                                        {artist.twitter ? (
                                            <a href={artist.twitter} style={socialIconStyle('#1da1f2')} title="Twitter" target="_blank" rel="noreferrer">
                                                <i className="fa-brands fa-twitter"></i>
                                            </a>
                                        ) : null}
                                        {artist.facebook ? (
                                            <a href={artist.facebook} style={socialIconStyle('#1877f2')} title="Facebook" target="_blank" rel="noreferrer">
                                                <i className="fa-brands fa-facebook"></i>
                                            </a>
                                        ) : null}
                                        {artist.instagram ? (
                                            <a href={artist.instagram} style={socialIconStyle('#e4405f')} title="Instagram" target="_blank" rel="noreferrer">
                                                <i className="fa-brands fa-instagram"></i>
                                            </a>
                                        ) : null}
                                        {artist.youtube ? (
                                            <a href={artist.youtube} style={socialIconStyle('#ff0000')} title="YouTube" target="_blank" rel="noreferrer">
                                                <i className="fa-brands fa-youtube"></i>
                                            </a>
                                        ) : null}
                                        {!artist.sound_cloud && !artist.twitter && !artist.facebook && !artist.instagram && !artist.youtube && (
                                            <div className="text-muted small italic">No social profiles linked for this artist.</div>
                                        )}
                                    </div>

                                    {(artist.facebook_profile_id || artist.instagram_profile_id) && (
                                        <div className="mt-4 pt-3 border-top">
                                            <div className="row g-3">
                                                {artist.facebook_profile_id && (
                                                    <div className="col-6">
                                                        <label className="text-secondary small fw-bold text-uppercase mb-1 d-block">FB Profile ID</label>
                                                        <div className="small fw-medium p-2 bg-light rounded text-center">{artist.facebook_profile_id}</div>
                                                    </div>
                                                )}
                                                {artist.instagram_profile_id && (
                                                    <div className="col-6">
                                                        <label className="text-secondary small fw-bold text-uppercase mb-1 d-block">Insta Profile ID</label>
                                                        <div className="small fw-medium p-2 bg-light rounded text-center">{artist.instagram_profile_id}</div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Additional Info */}
                            <div className="col-md-5">
                                <div className="card border-0 shadow-sm p-4 h-100" style={{ borderRadius: '15px' }}>
                                    <h6 className="fw-bold clPurple mb-4 border-bottom pb-2">
                                        <i className="fa-solid fa-circle-info me-2"></i>Resources
                                    </h6>
                                    <div className="d-flex flex-column gap-3">
                                        {artist.website ? (
                                            <div>
                                                <label className="text-secondary small fw-bold text-uppercase mb-1 d-block">Official Website</label>
                                                <a href={artist.website} target="_blank" rel="noreferrer" className="text-primary small text-decoration-none d-flex align-items-center">
                                                    <i className="fa-solid fa-globe me-2"></i>Visit Website
                                                </a>
                                            </div>
                                        ) : null}
                                        {artist.brandcamp ? (
                                            <div>
                                                <label className="text-secondary small fw-bold text-uppercase mb-1 d-block">Bandcamp</label>
                                                <a href={artist.brandcamp} target="_blank" rel="noreferrer" className="text-primary small text-decoration-none d-flex align-items-center">
                                                    <i className="fa-solid fa-music me-2"></i>Bandcamp Store
                                                </a>
                                            </div>
                                        ) : null}
                                        {artist.apple_image && (
                                            <div>
                                                <label className="text-secondary small fw-bold text-uppercase mb-1 d-block">Apple Asset Filename</label>
                                                <div className="small p-2 bg-light rounded border-start border-4 border-dark">{artist.apple_image}</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="mainBtn bgPurple clWhite" onClick={() => navigate(`/edit-artist/${artist._id || id}`)}>
                            Edit
                        </button>
                    </div>
                </div>

            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                .hover-bg-light:hover {
                    background-color: #f8f9fa !important;
                    transition: all 0.2s ease;
                }
                .backdrop-blur {
                    backdrop-filter: blur(5px);
                    -webkit-backdrop-filter: blur(5px);
                }
                .clPurple { color: #8e44ad; }
                .bgPurple { background-color: #8e44ad; }
                .bgSuccessSubtle { background-color: #d4edda; }
                .textSuccess { color: #155724; }
                .bgDangerSubtle { background-color: #f8d7da; }
                .textDanger { color: #721c24; }
            `}} />
        </section>
    );
}

export default ViewSingleArtistComponent;
