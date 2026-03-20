import React, { useState, useRef, useEffect } from 'react';

// Searchable Label Dropdown — single input, same form-select look
const LabelSearchSelect = ({ labels = [], value, onChange }) => {
    const [inputVal, setInputVal] = useState('');
    const [focused, setFocused] = useState(false);
    const wrapperRef = useRef(null);
    const inputRef = useRef(null);

    const selectedLabel = labels.find(l => l._id === value);

    // Only show dropdown when user has typed something
    const showDropdown = focused && inputVal.trim() !== '';
    const filtered = showDropdown
        ? labels.filter(l => l.name.toLowerCase().includes(inputVal.toLowerCase()))
        : [];

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setFocused(false);
                setInputVal('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleFocus = () => {
        setFocused(true);
        // Clear input so user can type fresh search; selected name shown as placeholder
        setInputVal('');
    };

    const handleBlur = () => {
        // Delay so onMouseDown on list items fires first
        setTimeout(() => {
            setFocused(false);
            setInputVal('');
        }, 150);
    };

    const handleSelect = (label) => {
        onChange(label._id, label.name);
        setFocused(false);
        setInputVal('');
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
            <input
                ref={inputRef}
                type="text"
                id="insider-select"
                className="form-select"
                style={{
                    cursor: 'text',
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '16px 12px',
                }}
                placeholder={selectedLabel ? selectedLabel.name : 'Search label...'}
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onFocus={handleFocus}
                onBlur={handleBlur}
                autoComplete="off"
            />

            {/* Results dropdown — only shown when typing */}
            {showDropdown && (
                <div
                    className="border rounded bg-white shadow-sm"
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 2px)',
                        left: 0,
                        right: 0,
                        zIndex: 1050,
                        maxHeight: '220px',
                        overflowY: 'auto',
                    }}
                >
                    {filtered.length === 0 ? (
                        <div className="px-3 py-2 text-muted small">No labels found</div>
                    ) : (
                        filtered.map(label => (
                            <div
                                key={label._id}
                                className="px-3 py-2"
                                style={{
                                    cursor: 'pointer',
                                    background: label._id === value ? '#f0e6ff' : 'transparent',
                                    fontWeight: label._id === value ? 600 : 400,
                                    fontSize: '0.9rem',
                                }}
                                onMouseDown={() => handleSelect(label)}
                                onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
                                onMouseLeave={e => e.currentTarget.style.background = label._id === value ? '#f0e6ff' : 'transparent'}
                            >
                                {label.name}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

// Searchable Artist Dropdown — same form-select look, multi-select
const ArtistSearchSelect = ({ artists = [], selectedArtists = [], onAdd }) => {
    const [inputVal, setInputVal] = useState('');
    const [focused, setFocused] = useState(false);
    const wrapperRef = useRef(null);

    const showDropdown = focused && inputVal.trim() !== '';
    const filtered = showDropdown
        ? artists.filter(a => a.name.toLowerCase().includes(inputVal.toLowerCase()))
        : [];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setFocused(false);
                setInputVal('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (artist) => {
        if (!selectedArtists.includes(artist.name)) {
            onAdd(artist.name);
        }
        setInputVal('');
        // Keep focused so user can keep adding
    };

    const handleBlur = () => {
        setTimeout(() => {
            setFocused(false);
            setInputVal('');
        }, 150);
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', flex: 1, minWidth: 0 }}>
            <input
                type="text"
                className="form-select"
                style={{
                    cursor: 'text',
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '16px 12px',
                }}
                placeholder="Search artist..."
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={handleBlur}
                autoComplete="off"
            />

            {showDropdown && (
                <div
                    className="border rounded bg-white shadow-sm"
                    style={{
                        position: 'absolute',
                        top: 'calc(100% + 2px)',
                        left: 0,
                        right: 0,
                        zIndex: 1050,
                        maxHeight: '220px',
                        overflowY: 'auto',
                    }}
                >
                    {filtered.length === 0 ? (
                        <div className="px-3 py-2 text-muted small">No artists found</div>
                    ) : (
                        filtered.map(artist => {
                            const alreadySelected = selectedArtists.includes(artist.name);
                            return (
                                <div
                                    key={artist._id || artist.name}
                                    className="px-3 py-2"
                                    style={{
                                        cursor: alreadySelected ? 'not-allowed' : 'pointer',
                                        background: alreadySelected ? '#f0e6ff' : 'transparent',
                                        color: alreadySelected ? '#888' : 'inherit',
                                        fontWeight: alreadySelected ? 600 : 400,
                                        fontSize: '0.9rem',
                                    }}
                                    onMouseDown={() => !alreadySelected && handleSelect(artist)}
                                    onMouseEnter={e => { if (!alreadySelected) e.currentTarget.style.background = '#f8f9fa'; }}
                                    onMouseLeave={e => { e.currentTarget.style.background = alreadySelected ? '#f0e6ff' : 'transparent'; }}
                                >
                                    {artist.name}
                                    {alreadySelected && <span className="ms-2 small">✓ added</span>}
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

// Searchable Genre Dropdown — same form-select look, single-select
const GenreSearchSelect = ({ genres = [], value, onChange }) => {
    const [inputVal, setInputVal] = useState('');
    const [focused, setFocused] = useState(false);
    const wrapperRef = useRef(null);

    const selectedGenre = genres.find(g => g._id === value);
    const showDropdown = focused && inputVal.trim() !== '';
    const filtered = showDropdown
        ? genres.filter(g => g.title.toLowerCase().includes(inputVal.toLowerCase()))
        : [];

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setFocused(false);
                setInputVal('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleBlur = () => setTimeout(() => { setFocused(false); setInputVal(''); }, 150);

    const handleSelect = (genre) => {
        onChange(genre._id);
        setFocused(false);
        setInputVal('');
    };

    return (
        <div ref={wrapperRef} style={{ position: 'relative', width: '100%' }}>
            <input
                type="text"
                className="form-select"
                style={{
                    cursor: 'text',
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M2 5l6 6 6-6'/%3e%3c/svg%3e")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 0.75rem center',
                    backgroundSize: '16px 12px',
                }}
                placeholder={selectedGenre ? selectedGenre.title : 'Search genre...'}
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={handleBlur}
                autoComplete="off"
            />
            {showDropdown && (
                <div
                    className="border rounded bg-white shadow-sm"
                    style={{ position: 'absolute', top: 'calc(100% + 2px)', left: 0, right: 0, zIndex: 1050, maxHeight: '220px', overflowY: 'auto' }}
                >
                    {filtered.length === 0 ? (
                        <div className="px-3 py-2 text-muted small">No genres found</div>
                    ) : (
                        filtered.map(g => (
                            <div
                                key={g._id}
                                className="px-3 py-2"
                                style={{ cursor: 'pointer', background: g._id === value ? '#f0e6ff' : 'transparent', fontWeight: g._id === value ? 600 : 400, fontSize: '0.9rem' }}
                                onMouseDown={() => handleSelect(g)}
                                onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
                                onMouseLeave={e => e.currentTarget.style.background = g._id === value ? '#f0e6ff' : 'transparent'}
                            >
                                {g.title}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

const Step1Details = ({
    form,
    update,
    errors,
    years,
    artists,
    labels,
    genres,
    subGenres,
    languages,
    setModalType,
    setModalInput,
    showError,
    handleArtworkUpload
}) => {
    return (
        <>
            <div className='main-sec-heading pb-5'>
                <h2 >Create your release</h2>
            </div>
            <div className="card-header mb-5 px-5">
                <h5 className="mb-0">1. Release <strong>Information</strong></h5>
            </div>
            <div className="main-release-info-sec px-5">

                <div className="row">
                    {/* Title */}
                    <div className="row">
                        <div className="col-md-4">
                            <div className="mb-4">
                                <label className="form-label fw-bold required">Title of album, EP or single</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter release title"
                                    value={form.title}
                                    onChange={e => update('title', e.target.value)}
                                />
                                {showError('title')}
                            </div>
                        </div>

                        {/* Instrumental */}
                        <div className="col-md-4">
                            <div className="mb-4">
                                <label className="form-label fw-bold">Instrumental</label>
                                <div className="btn-group castBtnSet d-flex w-100">
                                    <button
                                        type="button"
                                        className={`btn flex-fill ${form.isInstrumental ? 'bgPurple clWhite' : 'btn-outline-secondary'}`}
                                        onClick={() => update('isInstrumental', true)}
                                        style={{ height: '48px' }}
                                    >Yes</button>
                                    <button
                                        type="button"
                                        className={`btn flex-fill ${!form.isInstrumental ? 'bgPurple clWhite' : 'btn-outline-secondary'}`}
                                        onClick={() => update('isInstrumental', false)}
                                        style={{ height: '48px' }}
                                    >No</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {/* UPC */}
                        <div className="col-md-8 mb-4">
                            <label className="form-label required">UPC</label>
                            <div className="input-group">
                                <select
                                    className="form-select"
                                    style={{ maxWidth: '120px' }}
                                    value={form.upcMode || 'Auto'}
                                    onChange={(e) => {
                                        const mode = e.target.value;
                                        update('upcMode', mode);
                                        if (mode === 'Auto') {
                                            update('upc', '');
                                        }
                                    }}
                                >
                                    <option value="Auto">Auto</option>
                                    <option value="Manual">Manual</option>
                                </select>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={form.upcMode === 'Auto' ? '(Auto Generated)' : 'Enter UPC manually'}
                                    value={form.upc || ''}
                                    onChange={(e) => {
                                        if (form.upcMode === 'Manual') {
                                            update('upc', e.target.value);
                                        }
                                    }}
                                    disabled={form.upcMode !== 'Manual'}
                                    required
                                />
                            </div>

                            {showError('upc')}
                        </div>

                        {/* Label - Searchable Dropdown */}
                        <div className="col-md-8 mb-4">
                            <label className="form-label">Label</label>
                            <LabelSearchSelect
                                labels={labels}
                                value={form.label}
                                onChange={(labelId, labelName) => {
                                    update('label', labelId);
                                    if (labelName) {
                                        update('copyrightHolder', labelName);
                                    }
                                }}
                            />
                            {!!form.label && (() => {
                                const selected = labels.find(l => l._id === form.label);
                                return selected ? (
                                    <div className="mt-2">
                                        <span
                                            className="badge bg-light text-dark border border-secondary d-inline-flex align-items-center px-3 py-2"
                                            style={{ fontSize: '0.85rem' }}
                                        >
                                            {selected.name}
                                            <button
                                                type="button"
                                                className="btn-close ms-2"
                                                style={{ fontSize: '0.6rem' }}
                                                onClick={() => {
                                                    update('label', '');
                                                    update('copyrightHolder', '');
                                                }}
                                            ><i className="fa-solid fa-xmark"></i></button>
                                        </span>
                                    </div>
                                ) : null;
                            })()}
                        </div>

                    </div>
                    {/* Copyright Year + Holder */}
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <label className="form-label">Copyright Year</label>
                            <select id='insider-select' className="form-select " value={form.copyrightYear} onChange={e => update('copyrightYear', e.target.value)}>
                                {years.map((year) => (
                                    <option key={year} value={year.toString()}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4 mb-4">
                            <label className="form-label required">Copyright Holder</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter copyright holder"
                                value={form.copyrightHolder}
                                onChange={e => update('copyrightHolder', e.target.value)}
                            />
                            {showError('copyrightHolder')}
                        </div>
                    </div>

                    {/* Production Year + Holder */}
                    <div className="row">
                        <div className="col-md-4 mb-4">
                            <label className="form-label">Production Year</label>
                            <select id='insider-select' className="form-select" value={form.productionYear} onChange={e => update('productionYear', e.target.value)}>
                                {years.map((year) => (
                                    <option key={year} value={year.toString()}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-4 mb-4">
                            <label className="form-label required">Production Holder</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter production holder"
                                value={form.productionHolder}
                                onChange={e => update('productionHolder', e.target.value)}
                            />
                            {showError('productionHolder')}
                        </div>
                    </div>

                    {/* Release artist(s) */}
                    <div className="row">
                        <div className="col-md-8 mb-4">
                            <label className="form-label fw-bold required">Release artist(s)</label>

                            <div className="input-group mb-2">
                                <ArtistSearchSelect
                                    artists={artists}
                                    selectedArtists={form.releaseArtists.filter(a => a.trim() !== '')}
                                    onAdd={(name) => {
                                        const current = form.releaseArtists.filter(a => a !== '');
                                        if (!current.includes(name)) {
                                            update('releaseArtists', [...current, name]);
                                        }
                                    }}
                                />

                                <button
                                    type="button"
                                    className="ms-2 create-rel-form-btn mainBtn bgPurple clWhite"
                                    onClick={() => window.open('/add-artist', '_blank')}
                                >
                                    + Add release artist
                                </button>
                            </div>
                            {showError('releaseArtists')}
                            {form.releaseArtists.length > 0 && (
                                <div className="mt-3">
                                    <div className="d-flex flex-wrap gap-2">
                                        {form.releaseArtists
                                            .filter(name => name.trim() !== "")
                                            .map((artistName, index) => (
                                                <div
                                                    key={index}
                                                    className="badge bg-light text-dark border border-secondary d-flex align-items-center px-3 py-2"
                                                    style={{ fontSize: '0.95rem' }}
                                                >
                                                    {artistName}
                                                    <button
                                                        type="button"
                                                        className="btn-close ms-2"
                                                        style={{ fontSize: '0.7rem' }}
                                                        onClick={() => {
                                                            const updated = form.releaseArtists.filter((_, i) => i !== index);
                                                            update('releaseArtists', updated.length > 0 ? updated : ['']);
                                                        }}
                                                    ><i className="fa-solid fa-xmark"></i></button>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {form.releaseArtists.length === 0 && (
                                <small className="text-muted mt-2 d-block">
                                    Select or add one or more artists
                                </small>
                            )}
                        </div>
                    </div>

                </div>

                <div className="card-header ">
                    <h5>2. Release Artwork</h5>
                </div>
                <div className="card-body">
                    <div className="container p-4">
                        <div className="row g-4">
                            {/* Left - Preview + Warning */}
                            <div className="col-md-4">
                                <div className="border text-center p-5 bg-light position-relative" style={{ minHeight: '300px' }}>
                                    {form.artworkPreview ? (
                                        <img
                                            src={form.artworkPreview}
                                            alt="Artwork preview"
                                            className="img-fluid position-absolute top-50 start-50 translate-middle"
                                            style={{ maxHeight: '280px', maxWidth: '100%' }}
                                        />
                                    ) : (
                                        <div className="position-absolute top-50 start-50 translate-middle text-muted">
                                            <p className="mb-1 fw-bold">NO IMAGE</p>
                                            <small>GRAY AREA</small>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Middle - Requirements */}
                            <div className="col-md-4">
                                <div className="alert alert-info small h-100 d-flex flex-column justify-content-start ">
                                    <strong className='mb-2'>
                                        <i className="fa-solid fa-circle-info me-2"></i>Artwork requirements:
                                    </strong>
                                    Cover art must be a square jpg / jpeg file, at least 1400×1400 pixels, not blurry or pixelated<br />
                                    and no more than 10MB in size.<br /><br />
                                    Cover art cannot contain:<br />
                                    • Social media logos or handles<br />
                                    • Website links or brand/record label logos<br />
                                    • Any text except artist names and/or the name of the release<br /><br />
                                    If your cover art contains any of the above, we will have to reject your release.
                                    These rules will be set by the music stores and we have to follow them.
                                </div>
                            </div>

                            {/* Right - Drag & Drop area + validation message */}
                            <div className="col-md-3">
                                <div
                                    className="border border-dashed text-center p-4 rounded"
                                    style={{ minHeight: '180px', background: '#fff' }}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        const file = e.dataTransfer.files[0];
                                        if (handleArtworkUpload) handleArtworkUpload(file);
                                    }}
                                >
                                    <div className="mb-3">
                                        <i className="fas fa-image fa-3x text-muted"></i>
                                    </div>
                                    <p className="mb-1">Drag files here</p>
                                    <p className="small text-muted mb-3">or</p>
                                    <input
                                        type="file"
                                        id="artworkUpload"
                                        accept="image/jpeg,image/jpg,image/png"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (handleArtworkUpload) handleArtworkUpload(file);
                                        }}
                                    />
                                    <button
                                        className="mainBtn bgPurple clWhite"
                                        onClick={() => document.getElementById('artworkUpload').click()}
                                        type="button"
                                    >
                                        Select File
                                    </button>
                                    {form.artworkFile && (
                                        <div className="mt-3 small text-success">
                                            ✓ {form.artworkFile.name || 'Selected file'}
                                        </div>
                                    )}
                                </div>

                                {/* ─── ERROR MESSAGE APPEARS HERE ─── */}
                                {showError('artworkFile')}
                            </div>
                        </div>
                    </div>
                </div>

                {/* GENRES SECTION */}

                <div className='card-header '>
                    <h5>3. Release Genres</h5>
                </div>
                <div className="pt-4 pb-4 ">
                    <div className="row g-4 align-items-start">
                        <div className="col-md-4 mb-4">
                            <label className="form-label fw-bold required">Genre</label>
                            <GenreSearchSelect
                                genres={genres || []}
                                value={form.primaryGenre || ''}
                                onChange={val => update('primaryGenre', val)}
                            />
                            {showError('primaryGenre')}
                        </div>

                        <div className="col-md-4 mb-4">
                            <label className="form-label">Sub Genre</label>
                            <select
                                id='insider-select'
                                className="form-select"
                                value={form.secondaryGenre || ''}
                                onChange={e => update('secondaryGenre', e.target.value)}
                                disabled={!form.primaryGenre}
                            >
                                <option value="">Select sub-genre...</option>
                                {subGenres?.map(sg => (
                                    <option key={sg._id} value={sg._id}>{sg.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-4 mb-4">
                            <label className="form-label">Language</label>
                            <select
                                id='insider-select'
                                className="form-select"
                                value={form.language || ''}
                                onChange={e => update('language', e.target.value)}
                            >
                                <option value="">Select language...</option>
                                {languages?.map(l => (
                                    <option key={l._id} value={l._id}>{l.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="alert small border-primary">
                                <i className="fa-solid fa-circle-info me-2"></i>Not all genres are available on every store. When a genre you have selected does not exist on a specific store, we will select the closest alternative.
                                The stores distribute will use this info when they categorize your release.
                                You must select a genre, but a sub genre is optional.
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="alert small border-primary">
                                <i className="fa-solid fa-circle-info me-2"></i> If your tracks have lyrics, this can be used to target language-specific audience.
                            </div>
                        </div>
                    </div>

                </div>
            </div >
        </>
    );
};

export default Step1Details;
