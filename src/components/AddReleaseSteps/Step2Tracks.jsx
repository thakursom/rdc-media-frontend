import React from 'react';
import { toast } from "react-toastify";

const Step2Tracks = ({
    form,
    update,
    setForm,
    errors,
    showError,
    isUploading,
    globalProgress,
    handleTrackUpload,
    removeTrack,
    editingTrackId,
    setEditingTrackId,
    tempTrack,
    setTempTrack,
    years
}) => {
    const [playingTrackId, setPlayingTrackId] = React.useState(null);
    const audioRef = React.useRef(new Audio());

    React.useEffect(() => {
        const audio = audioRef.current;
        const handleEnded = () => setPlayingTrackId(null);
        audio.addEventListener('ended', handleEnded);
        return () => {
            audio.removeEventListener('ended', handleEnded);
            audio.pause();
        };
    }, []);

    const togglePlay = (track) => {
        const audio = audioRef.current;

        if (playingTrackId === track.id) {
            // Toggle pause/play for same track
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
                setPlayingTrackId(null); // Optional: clear state on pause if desired, or keep it to show pause icon
                // actually, for UI consistentcy: if paused, we usually want to show 'play' icon, so setting ID to null is fine 
                // OR we keep ID and check audio.paused. 
                // Let's keep ID to null on pause for simplicity, so button reverts to Play icon.
            }
        } else {
            // New track
            if (track.file) {
                const url = URL.createObjectURL(track.file);
                audio.src = url;
                // Note: we might need to revoke previous URL if we stored it, but simple create here is okay for now.
                // Better: track object might already have a preview URL if we did that, but currently it holds raw File.
                // We should be careful about creating too many object URLs. 
                // For now, let's just create it. 
                audio.play();
                setPlayingTrackId(track.id);
            } else {
                toast.error("No audio file found for this track");
            }
        }
    };

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

    const handleAudioReplace = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'audio/wav' && file.type !== 'audio/mpeg') {
            toast.error("Only .wav or .mp3 files allowed");
            return;
        }

        if (file.size > 200 * 1024 * 1024) {
            toast.error("File exceeds 200MB");
            return;
        }

        const duration = await getDuration(file);

        setTempTrack(prev => ({
            ...prev,
            file: file, // Update the file object
            name: file.name,
            size: file.size,
            type: file.type,
            duration: duration,
            previewStart: 0 // Reset preview start
        }));

        toast.success("Audio file replaced");
    };

    const handleLyricsUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // simple validation
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Lyrics file too large (max 5MB)");
            return;
        }

        setTempTrack(prev => ({
            ...prev,
            lyricsFile: file,
            lyricsFileName: file.name
        }));
    };

    return (
        <>
            <div className='main-sec-heading pb-5'>
                <h2 >Upload your music</h2>
            </div>

            <div className="track-meta">
                <div className="row  px-5">
                    <div className="col-md-4 mb-4 stream-col">
                        <div className='stem-child'>
                            <div
                                className="border border-dashed rounded p-5 text-center mb-4 bg-light mb-4"
                                onDragOver={e => { e.preventDefault(); e.stopPropagation(); }}
                                onDrop={e => {
                                    e.preventDefault(); e.stopPropagation();
                                    handleTrackUpload(e.dataTransfer.files);
                                }}
                            >
                                <i className="fas fa-music fa-4x clGreen mb-3"></i>
                                <h5>Drag files here or</h5>
                                <input
                                    type="file"
                                    id="trackUpload"
                                    multiple
                                    accept="audio/*"
                                    style={{ display: 'none' }}
                                    onChange={e => handleTrackUpload(e.target.files)}
                                />
                                <button
                                    className="btn bgGreen clWhite mt-2 px-4"
                                    onClick={() => document.getElementById('trackUpload').click()}
                                >
                                    Select files
                                </button>
                                {showError('tracks')}
                            </div>

                            <div className="alert small border-primary mb-0"><i className="fa-solid fa-circle-info me-2 mb-3"></i>Audio file requirements <br />
                                <p><i className="fa-solid fa-angle-right me-2 mb-2"></i> file format must be .wav or .mp3 (.wav is preferred)</p>
                                <p><i className="fa-solid fa-angle-right me-2 mb-2"></i> file size no larger than 200Mb</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 mb-4 stream-col">
                        {/* Track list - table style */}

                        <div className="track-list-container border rounded p-3 stem-child" style={{ background: "#fff" }}>
                            <h6 className="fw-bold mb-3">TRACK LIST</h6>

                            {form.tracks.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    No tracks added yet
                                </div>
                            ) : (
                                <>
                                    {isUploading ? (
                                        <div>
                                            <div className="progress" style={{ height: "6px" }}>
                                                <div
                                                    className="progress-bar bg-success"
                                                    role="progressbar"
                                                    style={{ width: `${globalProgress}%` }}
                                                    aria-valuenow={globalProgress}
                                                    aria-valuemin="0"
                                                    aria-valuemax="100"
                                                />
                                            </div>
                                            <small>{globalProgress}%</small>
                                        </div>
                                    ) : (
                                        <>
                                            {/* Show table ONLY if NOT editing */}
                                            {!editingTrackId ? (
                                                <table className="table">
                                                    <thead>
                                                        <tr>
                                                            <th>ORDER</th>
                                                            <th>PLAY</th>
                                                            <th>TITLE (VERSION) / ARTIST(S) / COPYRIGHT</th>
                                                            <th>METADATA</th>
                                                            <th>STATUS</th>
                                                            <th>ACTIONS</th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>
                                                        {form.tracks.map((track, idx) => (

                                                            <tr key={track.id || idx}>
                                                                <td>{idx + 1}</td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary rounded-circle"
                                                                        onClick={() => togglePlay(track)}
                                                                    >
                                                                        <i className={`fas ${playingTrackId === track.id ? 'fa-pause' : 'fa-play'}`}></i>
                                                                    </button>
                                                                </td>
                                                                <td>
                                                                    <div className="fw-bold">
                                                                        {track.title || "Untitled"}
                                                                        {track.version && ` (${track.version})`}
                                                                    </div>
                                                                    <div className={track.artists.length === 0 ? "text-danger small" : "small"}>
                                                                        by {track.artists.length > 0 ? track.artists.join(", ") : "Artist name?"}
                                                                    </div>
                                                                    <small className="text-muted">
                                                                        ©{track.copyrightYear || 2026}
                                                                    </small>
                                                                </td>
                                                                <td>
                                                                    Explicit: {track.explicit ? "Yes" : "No"}<br />
                                                                    ISRC: {track.isrc || "—"}
                                                                </td>
                                                                <td>
                                                                    {track.status === "uploading" || track.status === "processing" ? (
                                                                        <div>
                                                                            <div className="progress" style={{ height: '6px' }}>
                                                                                <div
                                                                                    className="progress-bar bg-success"
                                                                                    role="progressbar"
                                                                                    style={{ width: `${track.progress}%` }}
                                                                                    aria-valuenow={track.progress}
                                                                                    aria-valuemin="0"
                                                                                    aria-valuemax="100"
                                                                                ></div>
                                                                            </div>
                                                                            <small>{track.progress}%</small>
                                                                        </div>
                                                                    ) : track.status === "ready" ? (
                                                                        <span className="text-success">Ready</span>
                                                                    ) : (
                                                                        <span className="text-danger">Error</span>
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-primary me-2"
                                                                        onClick={() => {
                                                                            const trackToEdit = form.tracks.find(t => t.id === track.id);

                                                                            const releaseArtists = form.releaseArtists.filter(a => a?.trim());

                                                                            let initialTrackArtists = trackToEdit.artists || [];

                                                                            if (initialTrackArtists.length === 0 && releaseArtists.length > 0) {
                                                                                initialTrackArtists = [...releaseArtists];
                                                                            }

                                                                            const prefilled = {
                                                                                ...trackToEdit,
                                                                                artists: initialTrackArtists,
                                                                                newArtistInput: '',
                                                                            };

                                                                            setTempTrack(prefilled);
                                                                            setEditingTrackId(track.id);
                                                                        }}
                                                                    >
                                                                        <i className="fas fa-edit"></i> Edit
                                                                    </button>
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger"
                                                                        onClick={() => removeTrack(idx)}
                                                                    >
                                                                        <i className="fas fa-trash"></i>
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            ) : null}
                                        </>
                                    )}


                                    {/* Footer summary */}
                                    <div className="mt-3 small text-muted">
                                        {form.tracks.length} tracks •{" "}
                                        {Math.floor(form.tracks.reduce((sum, t) => sum + (t.duration || 0), 0) / 60)}:
                                        {(form.tracks.reduce((sum, t) => sum + (t.duration || 0), 0) % 60).toString().padStart(2, '0')}
                                    </div>

                                    <div className='track-append'>
                                        {editingTrackId && tempTrack && (
                                            <div className="modal-body p-4">
                                                <div className="d-flex justify-content-between align-items-center mb-4">
                                                    <h6 className='mb-0'>Track editing</h6>
                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        aria-label="Close"
                                                        onClick={() => {
                                                            setEditingTrackId(null);
                                                            setTempTrack(null);
                                                        }}
                                                    ></button>
                                                </div>

                                                {/* Uploaded file + Replace */}
                                                <div className="d-flex align-items-center gap-3 mb-4">
                                                    <label className="form-label fw-bold mb-0">Uploaded file:</label>
                                                    <div className="d-flex align-items-center gap-3">
                                                        <span className="text-primary">{tempTrack.name}</span>
                                                        <input
                                                            type="file"
                                                            id="replaceAudioInput"
                                                            style={{ display: 'none' }}
                                                            accept="audio/*"
                                                            onChange={handleAudioReplace}
                                                        />
                                                        <button
                                                            className="btn btn-sm btn-outline-secondary"
                                                            onClick={() => document.getElementById('replaceAudioInput').click()}
                                                        >
                                                            <i className="fas fa-sync-alt me-1"></i> Replace audio file
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Preview start time */}
                                                <div className="mb-4">

                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className='track-list-fx'>
                                                            <label className="form-label fw-bold">
                                                                Track <i className="fas fa-info-circle text-muted small ms-1"></i>
                                                            </label>
                                                            <input
                                                                type="number"
                                                                className="form-control w-25"
                                                                min="0"
                                                                max={tempTrack.duration}
                                                                value={tempTrack.previewStart || 0}
                                                                onChange={e => setTempTrack(prev => ({ ...prev, previewStart: Number(e.target.value) }))}
                                                            />
                                                        </div>
                                                        <button className="btn btn-outline-secondary btn-sm playBtn">
                                                            <i className="fas fa-play"></i>
                                                        </button>
                                                        <div className="flex-grow-1 progress-fx">
                                                            <p className="small text-muted mb-2">Select your track preview start time</p>

                                                            <div className="progress bg-light" style={{ height: '38px', marginBottom: "32px" }}>
                                                                <div
                                                                    className="progress-bar bg-primary"
                                                                    style={{ width: `${(tempTrack.previewStart / tempTrack.duration) * 100 || 0}%` }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                        <span className="small text-muted">
                                                            {Math.floor(tempTrack.previewStart / 60)}:
                                                            {(tempTrack.previewStart % 60).toString().padStart(2, '0')}
                                                        </span>
                                                    </div>
                                                    {tempTrack.duration < 30 && (
                                                        <small className="text-danger mt-1 d-block">
                                                            Preview time cannot be set for tracks less than 30 secs.
                                                        </small>
                                                    )}
                                                </div>

                                                {/* Track title + version */}
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-bold">
                                                            Track title <i className="fas fa-info-circle text-muted small ms-1"></i>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={tempTrack.title}
                                                            onChange={e => setTempTrack(prev => ({ ...prev, title: e.target.value }))}
                                                        />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <label className="form-label fw-bold">
                                                            Track mix version <i className="fas fa-info-circle text-muted small ms-1"></i>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={tempTrack.version}
                                                            onChange={e => setTempTrack(prev => ({ ...prev, version: e.target.value }))}
                                                            placeholder="e.g. Original Mix"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Single track title note */}
                                                {form.tracks.length === 1 && (
                                                    <div className="alert border-warning single-re-fx mb-4">
                                                        <strong><i className="fa-solid fa-circle-info me-2"></i> Single releases with only one track must be titled as the track.</strong><br />
                                                        Add another track to your release or edit your release title to change this track title.
                                                    </div>
                                                )}

                                                {/* Track artist(s) */}
                                                <div className="mb-4">
                                                    <label className="form-label fw-bold">
                                                        Track artist(s) <i className="fas fa-info-circle text-muted small ms-1"></i>
                                                    </label>

                                                    {form.releaseArtists.filter(a => a?.trim()).length === 0 ? (
                                                        <></>
                                                    ) : (
                                                        <>
                                                            {/* Primary / release-level artists (read-only) */}
                                                            <input
                                                                type="text"
                                                                className="form-control mb-2 bg-light"
                                                                placeholder="Primary artist(s) from release"
                                                                value={form.releaseArtists.filter(a => a?.trim()).join(", ")}
                                                                readOnly
                                                            />

                                                            {/* Additional artists (featuring, remix, etc.) */}
                                                            <div className="input-group mb-3">
                                                                <input
                                                                    type="text"
                                                                    className="form-control"
                                                                    placeholder="Add featuring / remix / additional artist"
                                                                    value={tempTrack.newArtistInput || ''}
                                                                    onChange={(e) =>
                                                                        setTempTrack((prev) => ({
                                                                            ...prev,
                                                                            newArtistInput: e.target.value,
                                                                        }))
                                                                    }
                                                                />
                                                                <button
                                                                    className="btn btn-outline-secondary"
                                                                    type="button"
                                                                    onClick={() => {
                                                                        const newName = (tempTrack.newArtistInput || '').trim();
                                                                        if (!newName) return;

                                                                        setTempTrack((prev) => {
                                                                            if (prev.artists?.includes(newName)) return prev; // avoid duplicates
                                                                            return {
                                                                                ...prev,
                                                                                artists: [...(prev.artists || []), newName],
                                                                                newArtistInput: '',
                                                                            };
                                                                        });
                                                                    }}
                                                                >
                                                                    + Add
                                                                </button>
                                                            </div>

                                                            {/* Show ALL artists (release + added ones) */}
                                                            {tempTrack.artists?.length > 0 && (
                                                                <div className="d-flex flex-wrap gap-2 mt-2">
                                                                    {tempTrack.artists.map((artist, index) => (
                                                                        <span
                                                                            key={index}
                                                                            className="badge bg-secondary text-white d-flex align-items-center px-3 py-2"
                                                                        >
                                                                            {artist}
                                                                            <button
                                                                                type="button"
                                                                                className="btn-close btn-close-white ms-2"
                                                                                style={{ fontSize: '0.7rem' }}
                                                                                onClick={() => {
                                                                                    setTempTrack((prev) => ({
                                                                                        ...prev,
                                                                                        artists: prev.artists.filter((_, i) => i !== index),
                                                                                    }));
                                                                                }}
                                                                            />
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>

                                                {/* Copyright & ISRC row */}
                                                <div className="row g-3 mb-4">
                                                    <div className="col-md-4">
                                                        <label className="form-label fw-bold">Copyright year</label>
                                                        <select
                                                            className="form-select"
                                                            value={tempTrack.copyrightYear}
                                                            onChange={e => setTempTrack(prev => ({ ...prev, copyrightYear: e.target.value }))}
                                                        >
                                                            {years.map((year) => (
                                                                <option key={year} value={year.toString()}>
                                                                    {year}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div className="col-md-4">
                                                        <label className="form-label fw-bold">Copyright holder</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            placeholder="Copyright holder name"
                                                            value={tempTrack.copyrightHolder}
                                                            onChange={e => setTempTrack(prev => ({ ...prev, copyrightHolder: e.target.value }))}
                                                        />

                                                    </div>

                                                    <div className="col-md-4">
                                                        <label className="form-label required">ISRC code</label>
                                                        <div className="input-group">
                                                            <select
                                                                id="upload-music"
                                                                className="form-select"
                                                                style={{ maxWidth: '120px' }}
                                                                value={tempTrack.isrcMode || 'Auto'}
                                                                onChange={(e) => {
                                                                    const mode = e.target.value;
                                                                    setTempTrack(prev => ({
                                                                        ...prev,
                                                                        isrcMode: mode,
                                                                        isrc: mode === 'Auto' ? '' : prev.isrc
                                                                    }));
                                                                }}
                                                            >
                                                                <option value="Auto">Auto</option>
                                                                <option value="Manual">Manual</option>
                                                            </select>

                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                placeholder={tempTrack.isrcMode === 'Auto' ? '(Auto Generated)' : 'Enter ISRC manually'}
                                                                value={tempTrack.isrc || ''}
                                                                onChange={(e) => setTempTrack(prev => ({ ...prev, isrc: e.target.value }))}
                                                                disabled={tempTrack.isrcMode !== 'Manual' && (!tempTrack.isrcMode || tempTrack.isrcMode === 'Auto')} // safe check
                                                                required
                                                            />
                                                        </div>

                                                    </div>
                                                </div>

                                                {/* Lyrics toggle */}
                                                <div className="mb-4">
                                                    <label className="form-label fw-bold">Do you want to add lyrics?</label>
                                                    <div className="btn-group castBtnSet">
                                                        <button
                                                            className={`btn ${tempTrack.addLyrics ? 'btn-primary ' : 'btn-outline-primary'}`}
                                                            onClick={() => setTempTrack(prev => ({ ...prev, addLyrics: true }))}
                                                        >
                                                            Yes
                                                        </button>
                                                        <button
                                                            className={`btn ${!tempTrack.addLyrics ? 'btn-primary ' : 'btn-outline-primary'}`}
                                                            onClick={() => setTempTrack(prev => ({ ...prev, addLyrics: false, lyrics: '', lyricsFile: null }))}
                                                        >
                                                            No
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Explicit content */}
                                                {tempTrack.addLyrics && (
                                                    <div className="mb-4">
                                                        <div className='explicit-track'>
                                                            <div className="form-group form-text">
                                                                <label className="form-check-label mb-3" htmlFor="explicitYes">
                                                                    Add Lyrics
                                                                </label>
                                                                <textarea
                                                                    name=""
                                                                    id="lyrics"
                                                                    className="form-control mb-3"
                                                                    rows="4"
                                                                    value={tempTrack.lyrics || ''}
                                                                    onChange={e => setTempTrack(prev => ({ ...prev, lyrics: e.target.value }))}
                                                                ></textarea>
                                                            </div>
                                                            <div className="form-group form-text">
                                                                <label className="form-check-label mb-3" htmlFor="explicitNo">
                                                                    Or upload a document with lyrics
                                                                </label>
                                                                <div className="fileSelectBox">
                                                                    <input
                                                                        type="file"
                                                                        name="explicit"
                                                                        accept=".txt,.doc,.docx,.pdf"
                                                                        onChange={handleLyricsUpload}
                                                                    />
                                                                    <span>
                                                                        {tempTrack.lyricsFileName || "Click or Drag File Here"}
                                                                    </span>
                                                                </div>

                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                <div className='explicti-cont'>
                                                    <label className="form-label fw-bold d-block mb-4">Explicit content</label>

                                                    <div className="form-check form-check-inline form-radio p-0">
                                                        <input
                                                            className="form-check-input p-0 me-2"
                                                            type="radio"
                                                            name="explicit"
                                                            id="explicitYes"
                                                            checked={tempTrack.explicit}
                                                            onChange={() => setTempTrack(prev => ({ ...prev, explicit: true }))}
                                                        />
                                                        <label className="form-check-label" htmlFor="explicitYes">
                                                            Yes, these lyrics contain explicit content.
                                                        </label>
                                                    </div>
                                                    <div className="form-check form-check-inline form-radio p-0">
                                                        <input
                                                            className="form-check-input p-0 me-2"
                                                            type="radio"
                                                            name="explicit"
                                                            id="explicitNo"
                                                            checked={!tempTrack.explicit}
                                                            onChange={() => setTempTrack(prev => ({ ...prev, explicit: false }))}
                                                        />
                                                        <label className="form-check-label" htmlFor="explicitNo">
                                                            No explicit content.
                                                        </label>
                                                    </div>
                                                </div>

                                                {/* Track Credits - simple repeater style */}
                                                <div className=" pt-4">
                                                    <h6 className="fw-bold mb-3">TRACK CREDITS</h6>
                                                    <p className="small text-muted mb-4">
                                                        You need to add at least one name for each category of credits on this release.
                                                    </p>

                                                    {/* Composer */}
                                                    <div className="mb-3">
                                                        <label className="form-label fw-bold">Composer</label>
                                                        <input
                                                            type="text"
                                                            className="form-control mb-2"
                                                            placeholder="Name"
                                                            value={tempTrack.composer || ''}
                                                            onChange={e => setTempTrack(prev => ({ ...prev, composer: e.target.value }))}
                                                        />
                                                    </div>

                                                    {/* Producer */}
                                                    <div className="mb-3">
                                                        <label className="form-label fw-bold">Producer</label>
                                                        <input
                                                            type="text"
                                                            className="form-control mb-2"
                                                            placeholder="Name"
                                                            value={tempTrack.producer || ''}
                                                            onChange={e => setTempTrack(prev => ({ ...prev, producer: e.target.value }))}
                                                        />
                                                    </div>

                                                    {/* Lyricist */}
                                                    <div className="mb-3">
                                                        <label className="form-label fw-bold">Lyricist</label>
                                                        <input
                                                            type="text"
                                                            className="form-control mb-2"
                                                            placeholder="Name"
                                                            value={tempTrack.lyricist || ''}
                                                            onChange={e => setTempTrack(prev => ({ ...prev, lyricist: e.target.value }))}
                                                        />
                                                    </div>

                                                </div>

                                                {/* Buttons at bottom */}
                                                <div className="d-flex justify-content-between mt-5">
                                                    <button
                                                        className="btn bgGreen clWhite px-5 ms-auto"
                                                        onClick={() => {
                                                            setForm(prev => ({
                                                                ...prev,
                                                                tracks: prev.tracks.map(t =>
                                                                    t.id === editingTrackId ? { ...tempTrack, newArtistInput: undefined } : t
                                                                )
                                                            }));
                                                            setEditingTrackId(null);
                                                            setTempTrack(null);
                                                            toast.success("Track updated!");
                                                        }}
                                                    >
                                                        Finished editing track
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}

                        </div>
                    </div>
                    <div className="col-md-12">
                        <div className="track-mata-sec">
                            <div className="alert small border-warning mb-4"><i className="fa-solid fa-circle-info me-2 mb-3"></i> <strong>Please complete the following checklist before proceeding </strong>  <p> Please note that answering incorrectly to any of the following questions may result in delays to your music being sent to retailers.
                            </p>
                            </div>
                            <ul className="mt-2 list-unstyled px-0">
                                <li className={form.explicitConfirmation ? 'text-success' : 'text-danger'}>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="explicitConfirmation"
                                            checked={form.explicitConfirmation}
                                            onChange={() => update('explicitConfirmation', !form.explicitConfirmation)}
                                        />
                                        <label className="form-check-label" htmlFor="explicitConfirmation">
                                            I marked my release as explicit if it contains words or obscenities
                                        </label>
                                    </div>
                                    {/* {showError('explicitConfirmation')} */}
                                </li>
                                <li className={form.ownRightsConfirmation ? 'text-success' : 'text-danger'}>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="ownRightsConfirmation"
                                            checked={form.ownRightsConfirmation}
                                            onChange={() => update('ownRightsConfirmation', !form.ownRightsConfirmation)}
                                        />
                                        <label className="form-check-label" htmlFor="ownRightsConfirmation">
                                            I am authorized to distribute this music to stores and territories I select
                                        </label>
                                    </div>
                                    {/* {showError('ownRightsConfirmation')} */}
                                </li>
                                <li className={form.noOtherArtistName ? 'text-success' : 'text-danger'}>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="noOtherArtistName"
                                            checked={form.noOtherArtistName}
                                            onChange={() => update('noOtherArtistName', !form.noOtherArtistName)}
                                        />
                                        <label className="form-check-label" htmlFor="noOtherArtistName">
                                            I confirm that I am not using another artist's name
                                        </label>
                                    </div>
                                    {/* {showError('noOtherArtistName')} */}
                                </li>
                                <li className={form.noOtherAlbumTitle ? 'text-success' : 'text-danger'}>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="noOtherAlbumTitle"
                                            checked={form.noOtherAlbumTitle}
                                            onChange={() => update('noOtherAlbumTitle', !form.noOtherAlbumTitle)}
                                        />
                                        <label className="form-check-label" htmlFor="noOtherAlbumTitle">
                                            I confirm that I am not using another album title
                                        </label>
                                    </div>
                                    {/* {showError('noOtherAlbumTitle')} */}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Step2Tracks;
