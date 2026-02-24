import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import Loader from "../Loader/Loader";

function AddArtistComponent() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;

    const [loading, setLoading] = useState(isEdit);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    // Yup validation schema
    const validationSchema = Yup.object({
        name: Yup.string().trim().required("Artist name is required"),
        email: Yup.string().email("Invalid email format"),
        artist_image: isEdit
            ? Yup.string()
            : Yup.string().required("Artist image is required. Please upload an image."),
    });

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            sound_cloud: '',
            twitter: '',
            facebook: '',
            instagram: '',
            youtube: '',
            website: '',
            brandcamp: '',
            is_on_spotify: 0,
            spotify_link: '',
            is_on_apple: 0,
            apple_link: '',
            artist_image: '',
            artist_image_url: '',
            apple_image: '',
            youtube_image_url: '',
            youtube_link: '',
            facebook_profile_id: '',
            instagram_profile_id: '',
            isrc: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            if (isUploading) {
                toast.error("Please wait for the image to finish uploading.");
                return;
            }

            const endpoint = isEdit ? `/update-artist/${id}` : "/create-artist";
            const method = isEdit ? "PUT" : "POST";

            try {
                const response = await apiRequest(endpoint, method, values, true);
                if (response.success) {
                    toast.success(`Artist ${isEdit ? 'updated' : 'created'} successfully!`);
                    navigate('/view-artist');
                } else {
                    toast.error(response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} artist.`);
                }
            } catch (error) {
                console.error("Submit artist error:", error);
                toast.error("An error occurred. Please try again.");
            }
        },
    });

    useEffect(() => {
        if (isEdit) {
            fetchArtist();
        }
    }, [id]);

    // Cleanup blob URLs on unmount
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const fetchArtist = async () => {
        try {
            const response = await apiRequest(`/artist/${id}`, "GET", null, true);
            if (response.success && response.data && response.data.data) {
                const artist = response.data.data;
                formik.setValues({
                    name: artist.name || '',
                    email: artist.email || '',
                    sound_cloud: artist.sound_cloud || '',
                    twitter: artist.twitter || '',
                    facebook: artist.facebook || '',
                    instagram: artist.instagram || '',
                    youtube: artist.youtube || '',
                    website: artist.website || '',
                    brandcamp: artist.brandcamp || '',
                    is_on_spotify: artist.is_on_spotify ?? 0,
                    spotify_link: artist.spotify_link || '',
                    is_on_apple: artist.is_on_apple ?? 0,
                    apple_link: artist.apple_link || '',
                    artist_image: artist.artist_image || '',
                    artist_image_url: artist.artist_image_url || '',
                    apple_image: artist.apple_image || '',
                    youtube_image_url: artist.youtube_image_url || '',
                    youtube_link: artist.youtube_link || '',
                    facebook_profile_id: artist.facebook_profile_id || '',
                    instagram_profile_id: artist.instagram_profile_id || '',
                    isrc: artist.isrc || ''
                });
                if (artist.artist_image_url) {
                    setPreviewUrl(artist.artist_image_url);
                }
            } else {
                toast.error("Failed to fetch artist details");
                navigate('/view-artist');
            }
        } catch (error) {
            console.error("Fetch artist error:", error);
            toast.error("An error occurred while fetching artist details");
            navigate('/view-artist');
        } finally {
            setLoading(false);
        }
    };

    const handleRadioChange = (name, value) => {
        formik.setFieldValue(name, value);
    };

    const handleImageClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            // Create a synthetic event-like object so handleFileChange can process it
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInputRef.current.files = dataTransfer.files;
            handleFileChange({ target: { files: dataTransfer.files } });
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            toast.error("Please select a valid image file (JPG, PNG, etc.)");
            return;
        }

        const localUrl = URL.createObjectURL(file);
        setPreviewUrl(localUrl);
        setIsUploading(true);

        try {
            const uploadData = new FormData();
            uploadData.append('artist_image', file);

            const response = await apiRequest("/upload-image", "POST", uploadData, true);

            if (response.success && response.data && response.data.data) {
                const { filename, url } = response.data.data;
                formik.setFieldValue('artist_image', filename);
                formik.setFieldValue('artist_image_url', url);
                setPreviewUrl(url);
                toast.success("Image uploaded successfully");
            } else {
                setPreviewUrl(null);
                formik.setFieldValue('artist_image', '');
                formik.setFieldValue('artist_image_url', '');
                if (fileInputRef.current) fileInputRef.current.value = '';
                toast.error(response?.data?.message || "Image upload failed.");
            }
        } catch (error) {
            console.error("Image upload error:", error);
            setPreviewUrl(null);
            formik.setFieldValue('artist_image', '');
            formik.setFieldValue('artist_image_url', '');
            if (fileInputRef.current) fileInputRef.current.value = '';
            toast.error("An error occurred while uploading the image.");
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) {
        return <Loader message="Loading artist details..." variant="success" />;
    }

    const hasImage = !isUploading && (previewUrl || formik.values.artist_image_url);

    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="add-artist-sec">
                    <div className="artist-sec-heading">
                        <h6>{isEdit ? 'Edit Artist' : 'Add Artist'}</h6>
                    </div>

                    {/* Image Upload Box */}
                    <div className="artist-file-sec">
                        <div
                            className={`choose-artist-mainbox ${isUploading ? 'uploading' : ''} ${isDragging ? 'dragging' : ''}`}
                            onClick={handleImageClick}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            style={{
                                cursor: 'pointer',
                                position: 'relative',
                                padding: hasImage ? '0' : '',
                                border: isDragging
                                    ? '2px dashed #4cd964'
                                    : (formik.touched.artist_image && formik.errors.artist_image)
                                        ? '2px dashed #dc3545'
                                        : ''
                            }}
                            title="Click or drag & drop to upload artist image"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            {isUploading ? (
                                <>
                                    <div className="file-icon">
                                        <i className="fa-solid fa-spinner fa-spin" />
                                    </div>
                                    <h5>Uploading Image...</h5>
                                </>
                            ) : hasImage ? (
                                <div className="image-preview">
                                    <img
                                        src={previewUrl || formik.values.artist_image_url}
                                        alt="Artist Preview"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/120?text=No+Image';
                                        }}
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="file-icon">
                                        <i className={`fa-solid ${isEdit ? 'fa-user-pen' : 'fa-plus'}`} />
                                    </div>
                                    <h5>{isEdit ? 'Change Artist Image' : 'Upload Artist Image *'}</h5>
                                </>
                            )}
                        </div>
                        {formik.touched.artist_image && formik.errors.artist_image && (
                            <small className="text-danger d-block text-center mt-1">
                                {formik.errors.artist_image}
                            </small>
                        )}
                    </div>

                    {/* Form */}
                    <div className="artist-sec-main">
                        <form className="artist-sec-form" onSubmit={formik.handleSubmit}>
                            <div className="row">
                                <div className="col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                                    <div className="form-group artist-form">
                                        <label className="form-label required" htmlFor="name">Name</label>
                                        <input
                                            type="text"
                                            className={`form-control ${formik.touched.name && formik.errors.name ? 'is-invalid' : ''}`}
                                            placeholder="Artist Name"
                                            id="name"
                                            name="name"
                                            value={formik.values.name}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.name && formik.errors.name && (
                                            <small className="text-danger">{formik.errors.name}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                                    <div className="form-group artist-form">
                                        <label className="form-label" htmlFor="email">Email</label>
                                        <input
                                            type="email"
                                            className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                            placeholder="artist@example.com"
                                            id="email"
                                            name="email"
                                            value={formik.values.email}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                        />
                                        {formik.touched.email && formik.errors.email && (
                                            <small className="text-danger">{formik.errors.email}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                                    <div className="form-group artist-form">
                                        <label className="form-label" htmlFor="sound_cloud">Sound Cloud</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Sound Cloud Link"
                                            id="sound_cloud"
                                            name="sound_cloud"
                                            value={formik.values.sound_cloud}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                                    <div className="form-group artist-form">
                                        <label className="form-label" htmlFor="twitter">Twitter</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Twitter Link"
                                            id="twitter"
                                            name="twitter"
                                            value={formik.values.twitter}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                                    <div className="form-group artist-form">
                                        <label className="form-label" htmlFor="facebook">Facebook</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Facebook Link"
                                            id="facebook"
                                            name="facebook"
                                            value={formik.values.facebook}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                                    <div className="form-group artist-form">
                                        <label className="form-label" htmlFor="instagram">Instagram</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Instagram Link"
                                            id="instagram"
                                            name="instagram"
                                            value={formik.values.instagram}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                                    <div className="form-group artist-form">
                                        <label className="form-label" htmlFor="youtube">Youtube OAC</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Youtube Link"
                                            id="youtube"
                                            name="youtube"
                                            value={formik.values.youtube}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                                    <div className="form-group artist-form">
                                        <label className="form-label" htmlFor="website">Website</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Website Link"
                                            id="website"
                                            name="website"
                                            value={formik.values.website}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                                    <div className="form-group artist-form">
                                        <label className="form-label" htmlFor="brandcamp">Bandcamp</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Bandcamp Link"
                                            id="brandcamp"
                                            name="brandcamp"
                                            value={formik.values.brandcamp}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                                    <div className="form-group artist-form">
                                        <label className="form-label" htmlFor="isrc">ISRC (Optional)</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter ISRC"
                                            id="isrc"
                                            name="isrc"
                                            value={formik.values.isrc}
                                            onChange={formik.handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Artist Images Section */}
                            <section className="artist-images-sec mt-4">
                                <div className="spotify-heading">
                                    <h2>Artist Images</h2>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <div className="form-group artist-form">
                                            <label className="form-label">Artist Image Filename</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="artist_image"
                                                placeholder="Auto-filled after upload"
                                                value={formik.values.artist_image}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group artist-form">
                                            <label className="form-label">Artist Image URL</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="artist_image_url"
                                                placeholder="Auto-filled after upload"
                                                value={formik.values.artist_image_url}
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 mt-3">
                                        <div className="form-group artist-form">
                                            <label className="form-label">Apple Artist Image Filename</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="apple_image"
                                                placeholder="apple-image.jpg"
                                                value={formik.values.apple_image}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Spotify Section */}
                            <section className="sportify-main mt-4">
                                <div className="spotify-artist-page">
                                    <div className="spotify-heading">
                                        <h2>Spotify Artist Page</h2>
                                    </div>
                                    <div className="spotify-radio">
                                        <div className="spotify-radio-head">
                                            <h6>Is this artist on Spotify already?</h6>
                                        </div>
                                        <div className="artist-spotify-radio">
                                            <div className="form-group artist-radio">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="is_on_spotify"
                                                    id="spotify-radioYes"
                                                    checked={formik.values.is_on_spotify === 1}
                                                    onChange={() => handleRadioChange('is_on_spotify', 1)}
                                                />
                                                <label htmlFor="spotify-radioYes">Yes, I can provide a link</label>
                                            </div>
                                            <div className="form-group artist-radio">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="is_on_spotify"
                                                    id="spotify-radioNo"
                                                    checked={formik.values.is_on_spotify === 0}
                                                    onChange={() => handleRadioChange('is_on_spotify', 0)}
                                                />
                                                <label htmlFor="spotify-radioNo">No, I need an artist page created</label>
                                            </div>
                                            {formik.values.is_on_spotify === 1 && (
                                                <div className="form-group spotify-artist-link mt-2">
                                                    <label htmlFor="spotify_link">Spotify Artist Link</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="spotify_link"
                                                        name="spotify_link"
                                                        placeholder="https://open.spotify.com/artist/..."
                                                        value={formik.values.spotify_link}
                                                        onChange={formik.handleChange}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Apple Section */}
                            <section className="sportify-main mt-4">
                                <div className="spotify-artist-page">
                                    <div className="spotify-heading">
                                        <h2>Apple Artist Page</h2>
                                    </div>
                                    <div className="spotify-radio">
                                        <div className="spotify-radio-head">
                                            <h6>Is this artist on Apple Music already?</h6>
                                        </div>
                                        <div className="artist-spotify-radio">
                                            <div className="form-group artist-radio">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="is_on_apple"
                                                    id="appleYes"
                                                    checked={formik.values.is_on_apple === 1}
                                                    onChange={() => handleRadioChange('is_on_apple', 1)}
                                                />
                                                <label htmlFor="appleYes">Yes, I can provide a link</label>
                                            </div>
                                            <div className="form-group artist-radio">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="is_on_apple"
                                                    id="appleNo"
                                                    checked={formik.values.is_on_apple === 0}
                                                    onChange={() => handleRadioChange('is_on_apple', 0)}
                                                />
                                                <label htmlFor="appleNo">No, I need an artist page created</label>
                                            </div>
                                            {formik.values.is_on_apple === 1 && (
                                                <div className="form-group spotify-artist-link mt-2">
                                                    <label htmlFor="apple_link">Apple Artist Link</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        id="apple_link"
                                                        name="apple_link"
                                                        placeholder="https://music.apple.com/..."
                                                        value={formik.values.apple_link}
                                                        onChange={formik.handleChange}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* YouTube Section */}
                            <section className="youtube-main mt-4">
                                <div className="spotify-artist-page">
                                    <div className="spotify-heading">
                                        <h2>YouTube Details</h2>
                                    </div>
                                    <div className="row mt-3">
                                        <div className="col-md-6">
                                            <div className="form-group artist-form">
                                                <label className="form-label">YouTube Official Link</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="youtube_link"
                                                    placeholder="https://youtube.com/..."
                                                    value={formik.values.youtube_link}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="form-group artist-form">
                                                <label className="form-label">YouTube Image URL</label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="youtube_image_url"
                                                    placeholder="https://..."
                                                    value={formik.values.youtube_image_url}
                                                    onChange={formik.handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Profile IDs Section */}
                            <section className="other-socials mt-4">
                                <div className="spotify-heading">
                                    <h2>Profile IDs</h2>
                                </div>
                                <div className="row mt-3">
                                    <div className="col-md-6">
                                        <div className="form-group artist-form">
                                            <label className="form-label">Facebook Profile ID</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="facebook_profile_id"
                                                placeholder="Profile ID"
                                                value={formik.values.facebook_profile_id}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group artist-form">
                                            <label className="form-label">Instagram Profile ID</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="instagram_profile_id"
                                                placeholder="Profile ID"
                                                value={formik.values.instagram_profile_id}
                                                onChange={formik.handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Buttons */}
                            <div className="artist-btn-main mt-5">
                                <button
                                    type="submit"
                                    className="btn bgGreen clWhite px-5 py-2"
                                    disabled={formik.isSubmitting || isUploading}
                                >
                                    {formik.isSubmitting ? 'Saving...' : (isEdit ? 'Update Artist' : 'Save Artist')}
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary ms-3 px-5 py-2"
                                    onClick={() => navigate('/view-artist')}
                                    disabled={formik.isSubmitting}
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </>
    );
}

export default AddArtistComponent;
