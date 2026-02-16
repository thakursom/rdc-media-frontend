import React, { useState, useEffect } from 'react';
import { apiRequest } from "../services/api";
import { toast } from "react-toastify";
import * as Yup from 'yup';

import Step1Details from './AddReleaseSteps/Step1Details';
import Step2Tracks from './AddReleaseSteps/Step2Tracks';
import Step3Schedule from './AddReleaseSteps/Step3Schedule';
import Step4Stores from './AddReleaseSteps/Step4Stores';
import Step5Review from './AddReleaseSteps/Step5Review';

function AddReleaseComponent() {
    const currentYear = new Date().getFullYear();
    const years = Array(currentYear - 1949).fill().map((_, i) => currentYear - i);

    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        title: '',
        copyrightYear: currentYear,
        copyrightHolder: '',
        productionYear: currentYear,
        productionHolder: '',
        label: 0,
        releaseArtists: [''],
        isFirstRelease: null,
        isVariousArtists: false,
        artworkFile: null,
        artworkPreview: null,
        primaryGenre: '',
        secondaryGenre: '',
        language: '',
        upcMode: 'Auto',
        isrcMode: 'Auto',
        upc: '',
        isrc: '',
        tracks: [],
        copyrightDocs: null,
        explicitConfirmation: false,
        ownRightsConfirmation: false,
        noOtherArtistName: false,
        noOtherAlbumTitle: false,
        hasCopyrightDocs: false,
        releaseDate: '',
        priorityDistribution: false,
        releaseTime: '',
        countryRestrictions: 'No',
        previouslyReleased: 'No',
        chartRegistration: [],
        pricing: '',
        selectedStores: [],
        futureStores: 'Yes',
    });

    const [modalType, setModalType] = useState(null);
    const [modalInput, setModalInput] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [artists, setArtists] = useState([]);
    const [labels, setLabels] = useState([]);
    const [genres, setGenres] = useState([]);
    const [subGenres, setSubGenres] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [editingTrackId, setEditingTrackId] = useState(null);
    const [tempTrack, setTempTrack] = useState(null);

    const step1Schema = Yup.object({
        title: Yup.string().trim().required("Title is required"),
        copyrightHolder: Yup.string().trim().required("Copyright holder required"),
        productionHolder: Yup.string().trim().required("Production holder required"),
        primaryGenre: Yup.string().required("Primary genre is required"),
        releaseArtists: Yup.array()
            .test('has-artist', 'At least one artist is required', val => val && val.some(artist => artist.trim() !== '')),
        upc: Yup.string().when('upcMode', {
            is: 'Manual',
            then: (schema) => schema.required("UPC required in manual mode").matches(/^\d{14}$/, "UPC must be exactly 14 digits"),
            otherwise: (schema) => schema.nullable(),
        }),
        isrc: Yup.string().when('isrcMode', {
            is: 'Manual',
            then: (schema) => schema.required("ISRC required in manual mode").matches(/^[A-Z0-9]{12}$/, "ISRC must be 12 digits"),
            otherwise: (schema) => schema.nullable(),
        }),
        artworkFile: Yup.mixed()
            .nullable()
            .required("Cover artwork is required")
            .test("fileType", "Only JPG or JPEG files are allowed",
                value => !value || (value && value.type.match(/image\/jpe?g/)))
            .test("fileSize", "File size must be less than 10MB",
                value => !value || (value && value.size <= 10 * 1024 * 1024))
    });

    const step2Schema = Yup.object({
        tracks: Yup.array().min(1, "At least one track is required").required("Tracks are required"),
        // explicitConfirmation: Yup.boolean().oneOf(["Yes", "No"], "Please select an option"),
        // ownRightsConfirmation: Yup.boolean().oneOf(["Yes", "No"], "Please select an option"),
        // noOtherArtistName: Yup.boolean().oneOf(["Yes", "No"], "Please select an option"),
        // noOtherAlbumTitle: Yup.boolean().oneOf(["Yes", "No"], "Please select an option")
    });

    const step3Schema = Yup.object().shape({
        releaseDate: Yup.date()
            .nullable()
            .required("Release date is required")
            .min(new Date(), "Release date cannot be in the past")
            .typeError("Please select a valid date"),

        countryRestrictions: Yup.string()
            .oneOf(["Yes", "No"], "Please select an option")
            .required("Please indicate whether country restrictions apply"),

        previouslyReleased: Yup.string()
            .oneOf(["Yes", "No"], "Please select an option")
            .required("Please indicate if this release was previously released"),
    });

    const step4Schema = Yup.object().shape({
        pricing: Yup.string()
            .required("Please select a pricing tier"),
        selectedStores: Yup.array()
            .min(1, "Please select at least one store")
            .required("Store selection is required"),
        futureStores: Yup.string()
            .oneOf(["Yes", "No"], "Please select an option")
            .required("Please indicate preference for future stores"),
    });

    const [validationErrors, setValidationErrors] = useState({});

    const showError = (field) => {
        return validationErrors[field] ? (
            <div className="text-danger small mt-1 ms-1">
                {validationErrors[field]}
            </div>
        ) : null;
    };

    const update = (field, value) => {
        setForm((prev) => {
            if (field === 'primaryGenre' && prev.primaryGenre !== value) {
                return { ...prev, [field]: value, secondaryGenre: '' };
            }
            return { ...prev, [field]: value };
        });
    };


    const next = async () => {
        const schema = [step1Schema, step2Schema, step3Schema, step4Schema, null][step - 1];

        if (!schema) {
            if (step < 5) setStep(step + 1);
            return;
        }

        try {
            await schema.validate(form, { abortEarly: false });
            setValidationErrors({});
            if (step < 5) setStep(step + 1);
        } catch (err) {
            console.error("Validation error:", err);

            if (err.inner) {
                const errs = {};
                err.inner.forEach(e => {
                    errs[e.path] = e.message;
                });
                setValidationErrors(errs);
                toast.error("Please correct the highlighted fields");
                setTimeout(() => {
                    document.querySelector('.text-danger')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            } else {
                toast.error("An unexpected error occurred. Please check console.");
            }
        }
    };

    const back = () => {
        if (step > 1) setStep(step - 1);
    };

    const steps = [
        { num: 1, label: 'Details' },
        { num: 2, label: 'Tracks' },
        { num: 3, label: 'Schedule' },
        { num: 4, label: 'Stores' },
        { num: 5, label: 'Review' },
    ];

    const fetchData = async () => {
        if (step !== 1) return;

        try {
            // Fetch Artists
            const artistRes = await apiRequest("/artists", "GET", null, true);
            if (artistRes.success) setArtists(artistRes?.data?.artists || []);

            // Fetch Labels
            const labelRes = await apiRequest("/labels", "GET", null, true);
            if (labelRes.success) setLabels(labelRes?.data?.labels || []);

            // Fetch Genres
            const genreRes = await apiRequest("/genres", "GET", null, true);
            if (genreRes.success) setGenres(genreRes?.data?.data || []);

            // Fetch Languages
            const langRes = await apiRequest("/languages", "GET", null, true);
            if (langRes.success) setLanguages(langRes?.data?.data || []);

        } catch (err) {
            console.error("Failed to fetch initial data:", err);
            toast.error("Error loading form data");
        }
    };

    useEffect(() => {
        fetchData();
    }, [step]);

    // Fetch SubGenres when primaryGenre changes
    useEffect(() => {
        const fetchSubGenres = async () => {
            if (!form.primaryGenre) {
                setSubGenres([]);
                return;
            }

            try {
                const response = await apiRequest(`/subgenres?genre_id=${form.primaryGenre}`, "GET", null, true);
                if (response.success) {
                    setSubGenres(response?.data?.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch subgenres:", err);
            }
        };

        fetchSubGenres();
    }, [form.primaryGenre]);

    const handleArtworkUpload = (file) => {
        if (!file) return;

        setValidationErrors(prev => {
            const next = { ...prev };
            delete next.artworkFile;
            return next;
        });

        if (!file.type.match(/image\/jpe?g/)) {
            toast.error("Only JPG or JPEG files allowed");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            toast.error("File must be smaller than 10MB");
            return;
        }

        const previewUrl = URL.createObjectURL(file);

        update('artworkFile', file);
        update('artworkPreview', previewUrl);

        const img = new Image();
        img.onload = () => {
            if (img.width < 1400 || img.height < 1400) {
                toast.warn("Recommended: artwork should be at least 1400×1400 pixels");
            }
        };
        img.src = previewUrl;
    };


    const handleTrackUpload = async (files) => {
        if (!files || files.length === 0) return;

        const fileArray = Array.from(files);
        const errors = [];

        const getDuration = (file) => new Promise((resolve) => {
            const audio = document.createElement("audio");
            const url = URL.createObjectURL(file);
            audio.preload = "metadata";
            audio.onloadedmetadata = () => {
                URL.revokeObjectURL(url);
                resolve(Math.floor(audio.duration) || 0);
            };
            audio.onerror = () => resolve(0);
            audio.src = url;
        });

        for (const file of fileArray) {

            const isValidFormat = file.type === 'audio/wav' || file.type === 'audio/mpeg';
            if (!isValidFormat) {
                errors.push(`${file.name}: only .wav or .mp3 allowed (.wav preferred)`);
                continue;
            }

            if (file.size > 200 * 1024 * 1024) {
                errors.push(`${file.name} exceeds 200MB`);
                continue;
            }


            const duration = await getDuration(file);

            const newTrack = {
                id: `track-${Date.now()}-${Math.random().toString(36).slice(2)}`,
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                duration,
                status: "uploading",
                progress: 0,
                title: file.name.replace(/\.[^/.]+$/, ""),
                version: "",
                artists: [],
                isrc: "",
                explicit: false,
                previewStart: 0,
                copyrightYear: "",
                copyrightHolder: "",
                productionYear: "",
                productionHolder: "",
            };

            setForm(prev => ({ ...prev, tracks: [...prev.tracks, newTrack] }));

            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15 + 5;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    setForm(prev => ({
                        ...prev,
                        tracks: prev.tracks.map(t =>
                            t.id === newTrack.id ? { ...t, status: "ready", progress: 100 } : t
                        )
                    }));
                } else {
                    setForm(prev => ({
                        ...prev,
                        tracks: prev.tracks.map(t =>
                            t.id === newTrack.id ? { ...t, progress: Math.min(100, progress) } : t
                        )
                    }));
                }
            }, 300 + Math.random() * 400);
        }

        if (errors.length > 0) {
            toast.error(errors.join("\n"));
        }
    };


    const removeTrack = (index) => {
        const updatedTracks = form.tracks.filter((_, i) => i !== index);
        update('tracks', updatedTracks);
    };

    const handleCopyrightUpload = (file) => {
        if (!file) return;

        if (file.size > 25 * 1024 * 1024) {
            alert('File size must be less than 25MB');
            return;
        }

        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png'
        ];

        if (!allowedTypes.includes(file.type)) {
            alert('Invalid file type');
            return;
        }

        console.log("Uploading file:", file);
        console.log("File name:", file.name);

        console.log("Selected copyright file:", {
            name: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified
        });

        update('copyrightDocs', file);
    };


    const handleSubmit = async () => {
        try {
            if (form.upcMode === 'Manual' && !form.upc.trim()) {
                toast.error("UPC is required when Manual mode is selected");
                return;
            }
            if (form.isrcMode === 'Manual' && !form.isrc.trim()) {
                toast.error("ISRC is required when Manual mode is selected");
                return;
            }

            const formData = new FormData();

            if (form.artworkFile) {
                formData.append('artwork', form.artworkFile);
            }

            const tracksWithFlags = form.tracks.map(track => {
                const trackMeta = {
                    id: track.id,
                    name: track.name,
                    size: track.size,
                    type: track.type,
                    duration: track.duration,
                    title: track.title?.trim() || "",
                    version: track.version?.trim() || "",
                    artists: track.artists || [],
                    isrc: track.isrcMode === 'Auto' ? null : (track.isrc?.trim() || null),
                    isrcMode: track.isrcMode || 'Auto',
                    explicit: track.explicit || false,
                    previewStart: track.previewStart || 0,
                    copyrightYear: track.copyrightYear || "",
                    copyrightHolder: track.copyrightHolder?.trim() || "",
                    productionYear: track.productionYear || "",
                    productionHolder: track.productionHolder?.trim() || "",
                    composer: track.composer?.trim() || "",
                    producer: track.producer?.trim() || "",
                    lyricist: track.lyricist?.trim() || "",
                    lyrics: track.lyrics?.trim() || "",

                    hasNewAudioFile: false,
                    hasNewLyricsFile: false
                };

                if (track.file) {
                    formData.append('trackFiles', track.file);
                    trackMeta.hasNewAudioFile = true;
                }

                if (track.lyricsFile) {
                    formData.append('lyricsFiles', track.lyricsFile);
                    trackMeta.hasNewLyricsFile = true;
                }

                return trackMeta;
            });

            const releaseData = {
                ...form,
                upc: form.upcMode === 'Auto' ? null : form.upc?.trim() || null,
                isrc: form.isrcMode === 'Auto' ? null : form.isrc?.trim() || null,
                artworkFile: undefined,
                artworkPreview: undefined,
                copyrightDocs: undefined,
                tracks: tracksWithFlags
            };

            formData.append('data', JSON.stringify(releaseData));

            const result = await apiRequest("/create-release", "POST", formData, true);

            if (result.success) {
                toast.success("Release created successfully!");

                setStep(1);

                setForm({
                    title: '',
                    copyrightYear: '',
                    copyrightHolder: '',
                    productionYear: '',
                    productionHolder: '',
                    label: '',
                    releaseArtists: [''],
                    isFirstRelease: null,
                    isVariousArtists: false,
                    artworkFile: null,
                    artworkPreview: null,
                    primaryGenre: '',
                    secondaryGenre: '',
                    language: '',
                    upcMode: 'Auto',
                    isrcMode: 'Auto',
                    upc: '',
                    isrc: '',
                    tracks: [],
                    copyrightDocs: null,
                    explicitConfirmation: false,
                    ownRightsConfirmation: false,
                    noOtherArtistName: false,
                    noOtherAlbumTitle: false,
                    hasCopyrightDocs: false,
                    releaseDate: '',
                    priorityDistribution: false,
                    releaseTime: '',
                    countryRestrictions: '',
                    previouslyReleased: '',
                    chartRegistration: [],
                    pricing: '',
                    selectedStores: [],
                    futureStores: '',
                });

                if (form.artworkPreview) {
                    URL.revokeObjectURL(form.artworkPreview);
                }

                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                toast.error(result?.data?.message || "Failed to create release");
            }
        } catch (err) {
            console.error('Release creation failed:', err);
            toast.error(`Failed to create release: ${err.message || 'Unknown error'}`);
        }
    };

    const handleCreateEntity = async () => {
        if (!modalInput.trim()) return;

        setIsCreating(true);

        try {
            let endpoint = "";
            let fieldToUpdate = "";
            let successMessage = "";

            if (modalType === "label") {
                endpoint = "/create-label";
                fieldToUpdate = "label";
                successMessage = "Label created successfully!";
            } else if (modalType === "artist") {
                endpoint = "/create-artist";
                fieldToUpdate = "releaseArtists";
                successMessage = "Artist created successfully!";
            } else {
                throw new Error("Unknown modal type");
            }

            const payload = {
                name: modalInput.trim(),
            };

            const result = await apiRequest(endpoint, "POST", payload, true);

            if (result.success) {
                toast.success(successMessage);
                if (modalType === "label") {
                    update("label", modalInput.trim());
                } else if (modalType === "artist") {
                    setForm(prev => ({
                        ...prev,
                        releaseArtists: [...prev.releaseArtists, modalInput.trim()],
                    }));

                }
                setModalType(null);
                setModalInput("");
                fetchArtists();
            } else {
                toast.error(result?.data?.message || "Failed to create");
            }
        } catch (err) {
            console.error("Create failed:", err);
            toast.error(`Failed to create: ${err.message || "Unknown error"}`);
        } finally {
            setIsCreating(false);
        }
    };

    useEffect(() => {
        if (!form.releaseArtists?.length) return;

        setTempTrack(prev => {
            if (!prev) {
                return {
                    artists: [...form.releaseArtists],
                    newArtistInput: '',
                };
            }

            const currentArtists = prev.artists || [];

            const mergedArtists = [
                ...new Set([...form.releaseArtists, ...currentArtists])
            ];

            return {
                ...prev,
                artists: mergedArtists,
            };
        });
    }, [form.releaseArtists]);

    const uploadingTracks = form.tracks.filter(
        t => t.status === "uploading" || t.status === "processing"
    );

    const isUploading = uploadingTracks.length > 0;

    const globalProgress = uploadingTracks.length
        ? Math.round(
            uploadingTracks.reduce((sum, t) => sum + (t.progress || 0), 0) /
            uploadingTracks.length
        )
        : 0;




    return (
        <section className="right-sidebar" id="sidebarRight">
            <div className="my-4">
                <ul className="nav nav-pills nav-justified mb-5 step-header">
                    {steps.map((s) => (
                        <li key={s.num} className="nav-item">
                            <div
                                role="button"
                                onClick={() => setStep(s.num)}
                                className={`step-item 
                    ${step >= s.num ? "active" : ""} 
                    ${step > s.num ? "completed" : ""}
                `}
                            >
                                <span className="step-number">{s.num}</span>
                                <span className="step-label">{s.label}</span>
                            </div>
                        </li>
                    ))}
                </ul>

                {/* Step 1 - Release Information */}
                {step === 1 && (
                    <>
                        <Step1Details
                            form={form}
                            update={update}
                            errors={validationErrors}
                            years={years}
                            artists={artists}
                            labels={labels}
                            genres={genres}
                            subGenres={subGenres}
                            languages={languages}
                            setModalType={setModalType}
                            setModalInput={setModalInput}
                            showError={showError}
                            handleArtworkUpload={handleArtworkUpload}
                        />
                        {/* Navigation */}
                        <div className="d-flex justify-content-between mt-5 px-5">
                            <button className="btn bgGreen clWhite ms-auto" onClick={next}>
                                Next
                            </button>
                        </div>
                    </>
                )}

                {/* Step 2 - Tracks */}
                {step === 2 && (
                    <>
                        <Step2Tracks
                            form={form}
                            update={update}
                            setForm={setForm}
                            errors={validationErrors}
                            showError={showError}
                            isUploading={isUploading}
                            globalProgress={globalProgress}
                            handleTrackUpload={handleTrackUpload}
                            removeTrack={removeTrack}
                            editingTrackId={editingTrackId}
                            setEditingTrackId={setEditingTrackId}
                            tempTrack={tempTrack}
                            setTempTrack={setTempTrack}
                            years={years}
                        />
                        {/* Navigation */}
                        <div className="d-flex justify-content-between mt-5 px-5">
                            <button className="btn btn-outline-secondary" onClick={back}>Back</button>
                            <button className="btn bgGreen clWhite" onClick={next}>Next</button>
                        </div>
                    </>
                )}

                {/* Step 3 - Schedule */}
                {step === 3 && (
                    <>
                        <Step3Schedule
                            form={form}
                            update={update}
                            showError={showError}
                        />
                        <div className="d-flex justify-content-between mt-5 px-5">
                            <button className="btn btn-outline-secondary" onClick={back}>
                                Back
                            </button>
                            <button className="btn bgGreen clWhite" onClick={next}>
                                Next
                            </button>
                        </div>
                    </>
                )}

                {/* Step 4 - Stores */}
                {step === 4 && (
                    <>
                        <Step4Stores
                            form={form}
                            update={update}
                            errors={validationErrors}
                            showError={showError}
                        />
                        <div className="d-flex justify-content-between mt-5 px-5">
                            <button className="btn btn-outline-secondary" onClick={back}>
                                Back
                            </button>
                            <button className="btn bgGreen clWhite" onClick={next}>
                                Next
                            </button>
                        </div>
                    </>
                )}

                {/* Step 5 - Review */}
                {step === 5 && (
                    <>
                        <Step5Review
                            form={form}
                            handleSubmit={handleSubmit}
                            genres={genres}
                            subGenres={subGenres}
                            languages={languages}
                        />
                    </>
                )}

                <div
                    className={`modal fade ${modalType ? "show d-block" : ""}`}
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {modalType === "label" ? "Add New Label" : "Add New Artist"}
                                </h5>
                                <button
                                    className="btn-close"
                                    onClick={() => {
                                        setModalType(null);
                                        setModalInput("");
                                    }}
                                    disabled={isCreating}
                                />
                            </div>

                            <div className="modal-body">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={
                                        modalType === "label"
                                            ? "Enter label name"
                                            : "Enter artist name"
                                    }
                                    value={modalInput}
                                    onChange={e => setModalInput(e.target.value)}
                                    disabled={isCreating}
                                />
                            </div>

                            <div className="modal-footer">
                                <button
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setModalType(null);
                                        setModalInput("");
                                    }}
                                    disabled={isCreating}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn bgGreen clWhite"
                                    disabled={isCreating || !modalInput.trim()}
                                    onClick={handleCreateEntity}
                                >
                                    {isCreating ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" />
                                            Creating...
                                        </>
                                    ) : (
                                        "Create"
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* backdrop */}
                {modalType && (
                    <div
                        className="modal-backdrop fade show"
                        onClick={() => setModalType(null)}
                    />
                )}




            </div>
        </section>
    );
}

export default AddReleaseComponent;