import React from 'react';

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

                    <div className="row">
                        {/* UPC */}
                        <div className="col-md-4 mb-4">
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

                        {/* ISRC – same pattern */}
                        <div className="col-md-4 mb-4">
                            <label className="form-label required">ISRC</label>
                            <div className="input-group">
                                <select
                                    className="form-select"
                                    style={{ maxWidth: '120px' }}
                                    value={form.isrcMode || 'Auto'}
                                    onChange={(e) => {
                                        const mode = e.target.value;
                                        update('isrcMode', mode);
                                        if (mode === 'Auto') {
                                            update('isrc', '');
                                        }
                                    }}
                                >
                                    <option value="Auto">Auto</option>
                                    <option value="Manual">Manual</option>
                                </select>

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder={form.isrcMode === 'Auto' ? '(Auto Generated)' : 'Enter ISRC manually'}
                                    value={form.isrc || ''}
                                    onChange={(e) => {
                                        if (form.isrcMode === 'Manual') {
                                            update('isrc', e.target.value);
                                        }
                                    }}
                                    disabled={form.isrcMode !== 'Manual'}
                                    required
                                />
                            </div>
                            {showError('isrc')}
                        </div>
                    </div>
                    {/* Copyright Year + Holder */}
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

                    {/* Label */}
                    <div className="col-md-8 mb-4">
                        <label className="form-label">Label</label>
                        <div className="input-group mb-2">
                            <select
                                id='insider-select'
                                className="form-select"
                                value={form.label}
                                onChange={e => update("label", e.target.value)}
                            >
                                <option value="">Select a label...</option>

                                {labels.map(label => (
                                    <option
                                        key={label.id || label._id}
                                        value={label.id || label._id}
                                    >
                                        {label.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Release artist(s) */}
                    <div className="col-md-8 mb-4">
                        <label className="form-label fw-bold required">Release artist(s)</label>

                        <div className="input-group mb-2">
                            <select
                                id='insider-select'
                                className="form-select"
                                value={form.releaseArtists.length > 0 ? form.releaseArtists[form.releaseArtists.length - 1] : ""}
                                onChange={(e) => {
                                    const selectedName = e.target.value.trim();
                                    if (selectedName) {
                                        const currentArtists = form.releaseArtists.filter(a => a !== "");
                                        update('releaseArtists', [...currentArtists, selectedName]);
                                    }
                                }}
                            >
                                <option value="">Select an artist...</option>
                                {artists.map((artist) => (
                                    <option
                                        key={artist._id || artist.name}
                                        value={artist.name}
                                        title={artist.name} // Show full name on hover
                                    >
                                        {artist.name.length > 20 ? artist.name.substring(0, 20) + "..." : artist.name}
                                    </option>
                                ))}
                            </select>

                            <button
                                className="btn btn-outline-secondary ms-4 create-rel-form-btn"
                                onClick={() => {
                                    setModalType("artist");
                                    setModalInput("");
                                }}
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
                                                ></button>
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
                                        accept="image/jpeg,image/jpg"
                                        style={{ display: 'none' }}
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (handleArtworkUpload) handleArtworkUpload(file);
                                        }}
                                    />
                                    <button
                                        className="btn bgGreen clWhite btn-sm px-4"
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
                            <select
                                id='insider-select'
                                className="form-select"
                                value={form.primaryGenre || ''}
                                onChange={e => update('primaryGenre', e.target.value)}
                            >
                                <option value="">Select genre...</option>
                                {genres?.map(g => (
                                    <option key={g.id} value={g.id}>{g.title}</option>
                                ))}
                            </select>
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
                                    <option key={sg.id} value={sg.id}>{sg.title}</option>
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
                                    <option key={l.id} value={l.id}>{l.name}</option>
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
