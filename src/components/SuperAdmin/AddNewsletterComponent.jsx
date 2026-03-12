import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { apiRequest, ROOT_URL } from "../../services/api";
import { toast } from "react-toastify";
import JoditEditor from 'jodit-react';
import Loader from "../Loader/Loader";

function AddNewsletterComponent() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = !!id;
    const [loading, setLoading] = useState(isEdit);
    const [isUploading, setIsUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const editor = useRef(null);

    const validationSchema = Yup.object({
        titleArtist: Yup.string().trim().required("Title / Artist is required"),
        shortDescription: Yup.string().trim().required("Short Description is required"),
        image: Yup.string().required("Image is required. Please upload an image."),
        externalLink: Yup.string().url("Must be a valid URL").nullable(),
        status: Yup.string().oneOf(['Active', 'Inactive']).required("Status is required"),
        email: Yup.string().email("Invalid email format").nullable()
    });

    const formik = useFormik({
        initialValues: {
            titleArtist: '',
            shortDescription: '',
            image: '',
            image_url: '',
            externalLink: '',
            status: 'Active',
            email: ''
        },
        validationSchema,
        onSubmit: async (values) => {
            if (isUploading) {
                toast.error("Please wait for the image to finish uploading.");
                return;
            }

            const endpoint = isEdit ? `/update-newsletter/${id}` : "/create-newsletter";
            const method = isEdit ? "PUT" : "POST";

            try {
                const response = await apiRequest(endpoint, method, values, true);
                if (response.success) {
                    toast.success(`Newsletter ${isEdit ? 'updated' : 'created'} successfully!`);
                    navigate('/view-newsletter');
                } else {
                    toast.error(response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} newsletter.`);
                }
            } catch (error) {
                console.error("Submit newsletter error:", error);
                toast.error("An error occurred. Please try again.");
            }
        },
    });

    useEffect(() => {
        if (isEdit) {
            fetchNewsletter();
        }
    }, [id]);

    const fetchNewsletter = async () => {
        try {
            const response = await apiRequest(`/newsletter/${id}`, "GET", null, true);
            console.log("DEBUG: Full response from /newsletter/:id", response);

            if (response.success && response.data && response.data.data) {
                const newsletterData = response.data.data;

                formik.setValues({
                    titleArtist: newsletterData.titleArtist || '',
                    shortDescription: newsletterData.shortDescription || '',
                    image: newsletterData.image || '',
                    image_url: newsletterData.image_url || '',
                    externalLink: newsletterData.externalLink || '',
                    status: newsletterData.status || 'Active',
                    email: newsletterData.email || ''
                });

                if (newsletterData.image_url) {
                    let fullImageUrl = newsletterData.image_url;
                    if (fullImageUrl && !fullImageUrl.startsWith('http')) {
                        fullImageUrl = `${ROOT_URL}${fullImageUrl.startsWith('/') ? '' : '/'}${fullImageUrl}`;
                    }
                    console.log("DEBUG: Setting preview URL to:", fullImageUrl);
                    setPreviewUrl(fullImageUrl);
                }
            } else {
                toast.error("Failed to parse newsletter details");
                navigate('/view-newsletter');
            }
        } catch (error) {
            console.error("Fetch newsletter error:", error);
            toast.error("An error occurred while fetching newsletter details");
            navigate('/view-newsletter');
        } finally {
            setLoading(false);
        }
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
                formik.setFieldValue('image', filename);
                formik.setFieldValue('image_url', url);

                let fullImageUrl = url;
                if (fullImageUrl && !fullImageUrl.startsWith('http')) {
                    fullImageUrl = `${ROOT_URL}${fullImageUrl.startsWith('/') ? '' : '/'}${fullImageUrl}`;
                }
                setPreviewUrl(fullImageUrl);
                toast.success("Image uploaded successfully");
            } else {
                setPreviewUrl(null);
                formik.setFieldValue('image', '');
                formik.setFieldValue('image_url', '');
                if (fileInputRef.current) fileInputRef.current.value = '';
                toast.error(response?.data?.message || "Image upload failed.");
            }
        } catch (error) {
            console.error("Image upload error:", error);
            setPreviewUrl(null);
            formik.setFieldValue('image', '');
            formik.setFieldValue('image_url', '');
            if (fileInputRef.current) fileInputRef.current.value = '';
            toast.error("An error occurred while uploading the image.");
        } finally {
            setIsUploading(false);
        }
    };

    const hasImage = !isUploading && (previewUrl || formik.values.image_url);

    if (loading) {
        return <Loader message="Loading newsletter details..." variant="success" />;
    }

    return (
        <section className="right-sidebar" id="sidebarRight">
            <div className="add-subLabel-sec">
                <div className="add-subLab">
                    <div className="add-subLabel-heading">
                        <h6 className="clPurple">{isEdit ? 'Edit Newsletter' : 'Add Newsletter'}</h6>
                    </div>
                </div>
                <div className="add-newsLetter-mainbox">
                    <div className="artist-file-sec mb-4">
                        <div
                            className={`choose-artist-mainbox ${isUploading ? 'uploading' : ''} ${isDragging ? 'dragging' : ''}`}
                            onClick={handleImageClick}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                            style={{
                                cursor: 'pointer',
                                position: 'relative',
                                minHeight: '200px',
                                padding: hasImage ? '0' : '',
                                overflow: 'hidden',
                                border: isDragging
                                    ? '2px dashed #4cd964'
                                    : (formik.touched.image && formik.errors.image)
                                        ? '2px dashed #dc3545'
                                        : '2px dotted var(--clPurple)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            title="Click or drag & drop to upload image"
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
                                <div className="image-preview" style={{ width: '100%', height: '200px' }}>
                                    <img
                                        src={previewUrl || formik.values.image_url}
                                        alt="Newsletter Preview"
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#f8f9fa' }}
                                    />
                                </div>
                            ) : (
                                <>
                                    <div className="file-icon" style={{ fontSize: '30px', color: '#9747FF' }}>
                                        <i className="fa-solid fa-plus" />
                                    </div>
                                    <div className="chose-file-content mt-2">
                                        <h5>{isEdit ? 'Change Image' : 'Add Image'}</h5>
                                    </div>
                                </>
                            )}
                        </div>
                        {formik.touched.image && formik.errors.image && (
                            <small className="text-danger d-block text-center mt-2">
                                {formik.errors.image}
                            </small>
                        )}
                    </div>

                    <form className="add-Newsletter-form" onSubmit={formik.handleSubmit}>
                        <div className="form-group add-NewsLetter-group mb-3">
                            <label className="form-label required" htmlFor="titleArtist">
                                Title / Artist
                            </label>
                            <input
                                className={`form-control ${formik.touched.titleArtist && formik.errors.titleArtist ? 'is-invalid' : ''}`}
                                type="text"
                                id="titleArtist"
                                name="titleArtist"
                                value={formik.values.titleArtist}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.titleArtist && formik.errors.titleArtist && (
                                <small className="text-danger">{formik.errors.titleArtist}</small>
                            )}
                        </div>

                        <div className="form-group add-NewsLetter-group mb-3">
                            <label className="form-label required" htmlFor="shortDescription">
                                Short Description
                            </label>
                            <div className={formik.touched.shortDescription && formik.errors.shortDescription ? 'border border-danger rounded' : ''}>
                                <JoditEditor
                                    ref={editor}
                                    value={formik.values.shortDescription}
                                    config={{
                                        readonly: false,
                                        height: 300,
                                        showCharsCounter: false,
                                        showWordsCounter: false,
                                        showXPathInStatusbar: false,
                                        hidePoweredByJodit: true,
                                        statusbar: false
                                    }}
                                    onBlur={(newContent) => formik.setFieldValue('shortDescription', newContent)}
                                />
                            </div>
                            {formik.touched.shortDescription && formik.errors.shortDescription && (
                                <small className="text-danger">{formik.errors.shortDescription}</small>
                            )}
                        </div>

                        <div className="form-group add-NewsLetter-group mb-3">
                            <label className="form-label" htmlFor="externalLink">
                                External Link
                            </label>
                            <input
                                className={`form-control ${formik.touched.externalLink && formik.errors.externalLink ? 'is-invalid' : ''}`}
                                type="text"
                                id="externalLink"
                                name="externalLink"
                                value={formik.values.externalLink}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.externalLink && formik.errors.externalLink && (
                                <small className="text-danger">{formik.errors.externalLink}</small>
                            )}
                        </div>

                        <div className="form-group add-NewsLetter-group mb-3">
                            <label className="form-label required" htmlFor="status">
                                Status
                            </label>
                            <select
                                className={`form-select ${formik.touched.status && formik.errors.status ? 'is-invalid' : ''}`}
                                id="status"
                                name="status"
                                value={formik.values.status}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            >
                                <option value="" disabled>--- Select option ---</option>
                                <option value="Active">Active</option>
                                <option value="Inactive">Inactive</option>
                            </select>
                            {formik.touched.status && formik.errors.status && (
                                <small className="text-danger">{formik.errors.status}</small>
                            )}
                        </div>

                        <div className="form-group add-NewsLetter-group mb-4">
                            <label className="form-label" htmlFor="email">
                                Email (optional)
                            </label>
                            <input
                                className={`form-control ${formik.touched.email && formik.errors.email ? 'is-invalid' : ''}`}
                                type="email"
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

                        <div className="form-group add-NewsLetter-button d-flex gap-3 mt-4">
                            <button
                                type="button"
                                className="mainBtn bgGray clWhite "
                                onClick={() => navigate('/view-newsletter')}
                                disabled={formik.isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="mainBtn bgPurple clWhite"
                                id="newsLetterSubmit"
                                disabled={formik.isSubmitting || isUploading}
                            >
                                {formik.isSubmitting ? 'Saving...' : (isEdit ? 'Update Newsletter' : 'Save Newsletter')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}

export default AddNewsletterComponent;
