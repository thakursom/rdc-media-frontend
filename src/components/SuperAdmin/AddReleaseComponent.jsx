import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import * as Yup from 'yup';

import Step1Details from './AddReleaseSteps/Step1Details';
import Step2Tracks from './AddReleaseSteps/Step2Tracks';
import Step3Schedule from './AddReleaseSteps/Step3Schedule';
import Step4Stores from './AddReleaseSteps/Step4Stores';
import Step5Review from './AddReleaseSteps/Step5Review';

function AddReleaseComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || (id ? '/review' : null);

    const currentYear = new Date().getFullYear();
    const years = Array(currentYear - 1949).fill().map((_, i) => currentYear - i);

    const [step, setStep] = useState(1);
    const [form, setForm] = useState({
        title: '',
        releaseType: 'single',
        copyrightYear: currentYear,
        copyrightHolder: '',
        productionYear: currentYear,
        productionHolder: '',
        label: 0,
        releaseArtists: [],
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
        selectedStores: [], // Array of store IDs
        futureStores: 'Yes',
        countryRestrictionsList: [],
    });

    const [modalType, setModalType] = useState(null);
    const [modalInput, setModalInput] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [artists, setArtists] = useState([]);
    const [labels, setLabels] = useState([]);
    const [genres, setGenres] = useState([]);
    const [subGenres, setSubGenres] = useState([]);
    const [languages, setLanguages] = useState([]);
    const [stores, setStores] = useState([]);
    const [editingTrackId, setEditingTrackId] = useState(null);
    const [tempTrack, setTempTrack] = useState(null);
    const [countries, setCountries] = useState([]);

    const step1Schema = Yup.object({
        title: Yup.string().trim().required("Title is required"),
        copyrightHolder: Yup.string().trim().required("Copyright holder required"),
        productionHolder: Yup.string().trim().required("Production holder required"),
        primaryGenre: Yup.string().required("Primary genre is required"),
        releaseArtists: Yup.array()
            .test('has-artist', 'At least one artist is required', val => val && val.some(artist => artist.trim() !== '')),
        upc: Yup.string().trim().when('upcMode', {
            is: 'Manual',
            then: (schema) => schema.required("UPC required in manual mode").matches(/^[A-Z0-9]{8,15}$/, "Please enter a valid UPC/EAN (8-15 alphanumeric characters)"),
            otherwise: (schema) => schema.nullable(),
        }),
        isrc: Yup.string().when('isrcMode', {
            is: 'Manual',
            then: (schema) => schema.required("ISRC required in manual mode").matches(/^[A-Z0-9]{12}$/, "ISRC must be 12 digits"),
            otherwise: (schema) => schema.nullable(),
        }),
        artworkFile: Yup.mixed()
            .nullable()
            .test("is-required", "Cover artwork is required", function (value) {
                // If we have an ID (edit mode) or an existing preview, it's not strictly required as a new file
                if (id || this.parent.artworkPreview) return true;
                return !!value;
            })
            .test("fileType", "Only JPG or JPEG files are allowed",
                value => !value || (value && value.type.match(/image\/jpe?g/)))
            .test("fileSize", "File size must be less than 10MB",
                value => !value || (value && value.size <= 10 * 1024 * 1024))
    });

    const step2Schema = Yup.object({
        tracks: Yup.array().of(
            Yup.object().shape({
                title: Yup.string().required("Track title is required"),
                composer: Yup.string().trim().required("Composer is required"),
                lyricist: Yup.string().trim().when('$isInstrumental', {
                    is: false,
                    then: (schema) => schema.required("Lyricist is required"),
                    otherwise: (schema) => schema.nullable(),
                })
            })
        ).min(1, "At least one track is required")
    });

    const step3Schema = Yup.object().shape({
        releaseDate: Yup.date()
            .nullable()
            .required("Release date is required")
            .test("not-past", "Release date cannot be in the past", function (value) {
                if (id) return true; // Allow past dates in edit mode
                if (!value) return false;
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return value >= today;
            })
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
            await schema.validate(form, { abortEarly: false, context: { isInstrumental: form.isInstrumental } });
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
        if (step !== 1 && step !== 5) return;

        try {
            // Fetch Artists
            const artistRes = await apiRequest("/release-artists", "GET", null, true);
            if (artistRes.success) setArtists(artistRes?.data?.artists || []);

            // Fetch Labels
            const labelRes = await apiRequest("/all-labels", "GET", null, true);
            if (labelRes.success) setLabels(labelRes?.data?.data || []);

            // Fetch Genres
            const genreRes = await apiRequest("/release-genres?limit=1000", "GET", null, true);
            if (genreRes.success) setGenres(genreRes?.data?.data || []);

            // Fetch Languages
            const langRes = await apiRequest("/languages", "GET", null, true);
            if (langRes.success) {
                const langs = langRes?.data?.data || [];
                setLanguages(langs);
                // Auto-select English if no language is already chosen
                setForm(prev => {
                    if (prev.language) return prev; // already set (e.g. edit mode)
                    const english = langs.find(l => l.name.toLowerCase() === 'english');
                    return english ? { ...prev, language: english._id } : prev;
                });
            }

            // Fetch Stores
            const storeRes = await apiRequest("/release-dsps", "GET", null, true);
            if (storeRes.success && storeRes.data && storeRes.data.data) {
                setStores(storeRes.data.data);
            }

            // Fetch Countries
            const countryRes = await apiRequest("/countries?limit=1000", "GET", null, true);
            if (countryRes.success) {
                setCountries(countryRes?.data?.data || []);
            }

        } catch (err) {
            console.error("Failed to fetch initial data:", err);
            toast.error("Error loading form data");
        }
    };

    useEffect(() => {
        fetchData();
    }, [step]);

    // Re-fetch artists when user returns to this tab (e.g. after adding artist in new tab)
    useEffect(() => {
        const refreshArtists = async () => {
            try {
                const artistRes = await apiRequest("/release-artists", "GET", null, true);
                if (artistRes.success) setArtists(artistRes?.data?.artists || []);
            } catch (err) {
                // silently ignore
            }
        };

        window.addEventListener('focus', refreshArtists);
        return () => window.removeEventListener('focus', refreshArtists);
    }, []);

    // Fetch single release data if id exists (Edit mode)
    useEffect(() => {
        const fetchReleaseData = async () => {
            if (!id) return;

            try {
                const response = await apiRequest(`/releases/${id}`, "GET", null, true);
                if (response.success && response.data?.data) {
                    const release = response.data.data;
                    setForm({
                        title: release.title || '',
                        releaseType: release.release_type || 1,
                        copyrightYear: release.c_line_year || currentYear,
                        copyrightHolder: release.c_line || '',
                        productionYear: release.p_line_year || currentYear,
                        productionHolder: release.p_line || '',
                        label: release.label_id || 0,
                        releaseArtists: Array.isArray(release.display_artist) ? release.display_artist : [release.display_artist || ''],
                        isFirstRelease: release.is_first !== undefined ? !!release.is_first : (release.is_first_release !== undefined ? !!release.is_first_release : null),
                        isVariousArtists: !!(release.is_various !== undefined ? release.is_various : release.is_various_artists),
                        isInstrumental: !!release.is_instrumental,
                        artworkPreview: release.artwork_path || null,
                        artworkFile: null,
                        primaryGenre: release.genre_id || '',
                        secondaryGenre: release.subgenre_id || '',
                        language: release.language_id || '',
                        upcMode: release.upc_number ? 'Manual' : 'Auto',
                        upc: release.upc_number || '',
                        isrcMode: release.isrc ? 'Manual' : 'Auto',
                        isrc: release.isrc || '',
                        tracks: (release.tracks || []).map(t => {
                            let duration = t.duration || 0;
                            if (typeof duration === 'string' && duration.includes(':')) {
                                const [m, s] = duration.split(':').map(Number);
                                duration = (m * 60) + (s || 0);
                            } else {
                                duration = Number(duration) || 0;
                            }

                            return {
                                id: t._id,
                                title: t.title,
                                version: t.mix_version || '',
                                artists: Array.isArray(t.display_artist) ? t.display_artist : [t.display_artist || ''],
                                isrc: t.isrc_number || '',
                                isrcMode: t.isrc_number ? 'Manual' : 'Auto',
                                explicit: !!t.explicit,
                                duration: duration,
                                previewStart: t.preview_start || 0,
                                copyrightYear: t.c_line_year || '',
                                copyrightHolder: t.c_line || '',
                                productionYear: t.p_line_year || '',
                                productionHolder: t.p_line || '',
                                composer: t.composer || '',
                                producer: t.producer || '',
                                lyricist: t.lyricist || '',
                                lyrics: t.lyrics_text || '',
                                audio_path: t.audio_path,
                                status: 'ready'
                            };
                        }),
                        copyrightDocs: null,
                        explicitConfirmation: true,
                        ownRightsConfirmation: true,
                        noOtherArtistName: true,
                        noOtherAlbumTitle: true,
                        hasCopyrightDocs: !!release.copyright_docs,
                        releaseDate: release.release_date ? new Date(release.release_date).toISOString().split('T')[0] : '',
                        priorityDistribution: !!(release.is_priority),
                        releaseTime: release.release_time || '00:00',
                        countryRestrictions: release.country_restrictions || 'No',
                        countryRestrictionsList: Array.isArray(release.country_restrictions_list) ? release.country_restrictions_list : [],
                        previouslyReleased: release.previously_released || 'No',
                        chartRegistration: release.chart_registration || [],
                        pricing: release.pricing || '',
                        selectedStores: Array.isArray(release.store_ids) ? release.store_ids : [],
                        futureStores: release.future_stores || 'Yes',
                    });
                }
            } catch (err) {
                console.error("Failed to fetch release data:", err);
                toast.error("Error loading release details");
            }
        };

        fetchReleaseData();
    }, [id]);

    // Fetch SubGenres when primaryGenre changes
    useEffect(() => {
        const fetchSubGenres = async () => {
            if (!form.primaryGenre) {
                setSubGenres([]);
                return;
            }

            try {
                const response = await apiRequest(`/release-subgenres?genre_id=${form.primaryGenre}`, "GET", null, true);
                if (response.success) {
                    setSubGenres(response?.data?.data || []);
                }
            } catch (err) {
                console.error("Failed to fetch subgenres:", err);
            }
        };

        fetchSubGenres();
    }, [form.primaryGenre]);

    // Helper: check file magic bytes to confirm it is a real JPEG or PNG
    const checkImageMagicBytes = (file) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = (e) => {
            const bytes = new Uint8Array(e.target.result);
            // JPEG: FF D8 FF
            const isJpeg = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
            // PNG: 89 50 4E 47 0D 0A 1A 0A
            const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47
                && bytes[4] === 0x0D && bytes[5] === 0x0A && bytes[6] === 0x1A && bytes[7] === 0x0A;
            resolve(isJpeg || isPng);
        };
        reader.onerror = () => resolve(false);
        // Read only the first 8 bytes
        reader.readAsArrayBuffer(file.slice(0, 8));
    });

    const handleArtworkUpload = async (file) => {
        if (!file) return;

        setValidationErrors(prev => {
            const next = { ...prev };
            delete next.artworkFile;
            return next;
        });

        // 1. Magic-byte check (catches renamed files)
        const isRealImage = await checkImageMagicBytes(file);
        if (!isRealImage) {
            toast.error("Invalid file: only real JPEG or PNG images are accepted.");
            return;
        }

        // 2. MIME type check
        if (!file.type.match(/image\/jpe?g/) && !file.type.match(/image\/png/)) {
            toast.error("Only JPG, JPEG, or PNG image files are allowed");
            return;
        }

        // 3. File size check
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



    // Helper: verify audio magic bytes — MP3 or WAV only
    const checkAudioMagicBytes = (file) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = (e) => {
            const b = new Uint8Array(e.target.result);
            // MP3 with ID3 tag: 49 44 33 ("ID3")
            const isMP3_ID3 = b[0] === 0x49 && b[1] === 0x44 && b[2] === 0x33;
            // MP3 raw frame sync: FF FB | FF F3 | FF F2
            const isMP3_Raw = b[0] === 0xFF && (b[1] === 0xFB || b[1] === 0xF3 || b[1] === 0xF2);
            // WAV: "RIFF" at 0-3 and "WAVE" at 8-11
            const isWAV = b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46
                && b[8] === 0x57 && b[9] === 0x41 && b[10] === 0x56 && b[11] === 0x45;
            resolve(isMP3_ID3 || isMP3_Raw || isWAV);
        };
        reader.onerror = () => resolve(false);
        reader.readAsArrayBuffer(file.slice(0, 12));
    });

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

            // 1. Magic-byte check (catches renamed non-audio files)
            const isRealAudio = await checkAudioMagicBytes(file);
            if (!isRealAudio) {
                errors.push(`${file.name}: invalid file — only real MP3 or WAV audio is accepted.`);
                continue;
            }

            // 2. MIME type check
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
            const trackId = `track-${Date.now()}-${Math.random().toString(36).slice(2)}`;
            const releaseArtists = (form.releaseArtists || []).filter(a => a?.trim());

            const newTrack = {
                id: trackId,
                file,
                name: file.name,
                size: file.size,
                type: file.type,
                duration,
                status: "uploading",
                progress: 0,
                title: form.title || file.name.replace(/\.[^/.]+$/, ""),
                version: "",
                artists: [...releaseArtists], // copy release artists
                isrc: "",
                explicit: false,
                previewStart: 0,
                copyrightYear: currentYear,
                copyrightHolder: form.copyrightHolder || "",
                productionYear: currentYear,
                productionHolder: form.productionHolder || "",
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
                            t.id === trackId ? { ...t, status: "ready", progress: 100 } : t
                        )
                    }));
                } else {
                    setForm(prev => ({
                        ...prev,
                        tracks: prev.tracks.map(t =>
                            t.id === trackId ? { ...t, progress: Math.min(100, progress) } : t
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
                    mix_version: track.version?.trim() || "",
                    display_artist: track.artists || [],
                    isrc_number: track.isrcMode === 'Auto' ? null : (track.isrc?.trim() || null),
                    isrcMode: track.isrcMode || 'Auto',
                    explicit: track.explicit || false,
                    preview_start: track.previewStart || 0,
                    c_line_year: track.copyrightYear || "",
                    c_line: track.copyrightHolder?.trim() || "",
                    p_line_year: track.productionYear || "",
                    p_line: track.productionHolder?.trim() || "",
                    composer: track.composer?.trim() || "",
                    producer: track.producer?.trim() || "",
                    lyricist: track.lyricist?.trim() || "",
                    lyrics_text: track.lyrics?.trim() || "",

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
                release_type: form.releaseType,
                c_line_year: form.copyrightYear,
                c_line: form.copyrightHolder?.trim() || "",
                p_line_year: form.productionYear,
                p_line: form.productionHolder?.trim() || "",
                label_id: form.label,
                display_artist: form.releaseArtists,
                country_restrictions: form.countryRestrictions,
                country_restrictions_list: form.countryRestrictionsList,
                is_instrumental: form.isInstrumental ? 1 : 0,
                is_first: form.isFirstRelease,
                is_various: form.isVariousArtists,
                genre_id: form.primaryGenre,
                subgenre_id: form.secondaryGenre,
                language_id: form.language,
                upc_number: form.upcMode === 'Auto' ? null : (form.upc?.trim() || null),
                isrc: form.isrcMode === 'Auto' ? null : (form.isrc?.trim() || null),
                artworkFile: undefined,
                artworkPreview: undefined,
                copyrightDocs: undefined,
                tracks: tracksWithFlags,
                create_type: tracksWithFlags.length > 0 ? "Pending" : "Saved"
            };

            formData.append('data', JSON.stringify(releaseData));

            const endpoint = id ? `/update-release/${id}` : "/create-release";
            const method = id ? "PUT" : "POST";

            const result = await apiRequest(endpoint, method, formData, true);

            if (result.success) {
                toast.success(id ? "Release updated successfully!" : "Release created successfully!");
                navigate("/review");
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                toast.error(result?.data?.message || `Failed to ${id ? 'update' : 'create'} release`);
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
                endpoint = "/create-release-artist";
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
                    const newLabel = result?.data?.data || { name: modalInput.trim(), id: Date.now() }; // Fallback with ID if needed
                    setLabels(prev => [...prev, newLabel]);
                    update("label", newLabel._id);
                } else if (modalType === "artist") {
                    const newArtist = result?.data?.artist || { name: modalInput.trim() };
                    setArtists(prev => [...prev, newArtist]);
                    setForm(prev => ({
                        ...prev,
                        releaseArtists: [...prev.releaseArtists, modalInput.trim()],
                    }));

                }
                setModalType(null);
                setModalInput("");
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
                            isEdit={!!id}
                        />
                        {/* Navigation */}
                        <div className="d-flex justify-content-between mt-5 px-5">
                            <button className="mainBtn bgPurple clWhite ms-auto" onClick={next}>
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
                            <button className="mainBtn bgGray clWhite" onClick={back}>Back</button>
                            <button className="mainBtn bgPurple clWhite" onClick={next}>Next</button>
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
                            countries={countries}
                        />
                        <div className="d-flex justify-content-between mt-5 px-5">
                            <button className="mainBtn bgGray clWhite" onClick={back}>
                                Back
                            </button>
                            <button className="mainBtn bgPurple clWhite" onClick={next}>
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
                            stores={stores}
                        />
                        <div className="d-flex justify-content-between mt-5 px-5">
                            <button className="mainBtn bgGray clWhite" onClick={back}>
                                Back
                            </button>
                            <button className="mainBtn bgPurple clWhite" onClick={next}>
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
                            stores={stores}
                            countries={countries}
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
                                <button className="btn-close" onClick={() => setModalType(null)}><i className="fa-solid fa-xmark"></i></button>
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
                                    className="mainBtn bgGray clWhite"
                                    onClick={() => {
                                        setModalType(null);
                                        setModalInput("");
                                    }}
                                    disabled={isCreating}
                                >
                                    Cancel
                                </button>

                                <button
                                    className="btn bgPurple clWhite"
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
