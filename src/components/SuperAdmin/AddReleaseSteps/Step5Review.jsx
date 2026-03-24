import React from 'react';

const Step5Review = ({ form, handleSubmit, genres, subGenres, languages, labels, stores, countries, isDirty, isEdit }) => {
    console.log("form", form);
    // Helper to find name by ID
    const getLanguageName = (id) => {
        const lang = languages?.find(l => String(l._id).trim() == String(id).trim());
        return lang ? lang.name : id || '(not set)';
    };

    const getStoreNames = (selectedIds) => {
        if (!selectedIds || selectedIds.length === 0) return 'None selected';
        return selectedIds.map(id => {
            const store = stores?.find(s => String(s._id).trim() == String(id).trim());
            return store ? store.name : id;
        }).join(', ');
    };

    const getGenreName = (id) => {
        const g = genres?.find(g => String(g._id).trim() == String(id).trim());
        return g ? g.title : id || '(not set)';
    };

    const getSubGenreName = (id) => {
        const sg = subGenres?.find(s => String(s._id).trim() == String(id).trim());
        return sg ? sg.title : id || '-';
    };

    const getLabelName = (id) => {
        const l = labels?.find(l => String(l._id).trim() == String(id).trim());
        return l ? l.name : id || '(not set)';
    };

    return (
        <>
            <div className="main-sec-heading pb-5"><h2>Review Your Release</h2></div>
            <div className="card">
                <div className="card-header bg-warning text-dark">
                    <small>Please review steps 1–4 and submit your release</small>
                </div>
                <div className="card-body">
                    <div className="row">
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
                            <small>Release Artwork</small>
                        </div>
                        <div className="col-md-8">
                            <h6>Release Summary</h6>
                            <table className="table table-sm">
                                <tbody>
                                    <tr>
                                        <th>Title</th>
                                        <td>{form.title || '(not set)'}</td>
                                    </tr>
                                    <tr>
                                        <th>Type</th>
                                        <td>Single</td>
                                    </tr>
                                    <tr>
                                        <th>Genre</th>
                                        <td>{getGenreName(form.primaryGenre)}</td>
                                    </tr>
                                    <tr>
                                        <th>Sub Genre</th>
                                        <td>{getSubGenreName(form.secondaryGenre)}</td>
                                    </tr>
                                    <tr>
                                        <th>Language</th>
                                        <td>{getLanguageName(form.language)}</td>
                                    </tr>
                                    <tr>
                                        <th>Label</th>
                                        <td>{getLabelName(form.label)}</td>
                                    </tr>
                                    <tr>
                                        <th>Primary Artist</th>
                                        <td>{form.releaseArtists[0] || '(not set)'}</td>
                                    </tr>
                                    <tr>
                                        <th>Release Date</th>
                                        <td>{form.releaseDate || '(not set)'}</td>
                                    </tr>
                                    <tr>
                                        <th>Stores</th>
                                        <td>{getStoreNames(form.selectedStores)}</td>
                                    </tr>
                                    <tr>
                                        <th>Country Restrictions</th>
                                        <td>
                                            {form.countryRestrictions === 'Yes'
                                                ? `${form.countryRestrictionsList?.length || 0} countries restricted: ${form.countryRestrictionsList?.join(', ') || 'None selected'}`
                                                : 'No restrictions'
                                            }
                                        </td>
                                    </tr>
                                </tbody>
                            </table>

                            <h6 className="mt-4">Tracklist Details</h6>
                            {form.tracks.length === 0 ? (
                                <div className="alert alert-warning">No tracks uploaded yet</div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-bordered table-sm small">
                                        <thead className="table-light">
                                            <tr>
                                                <th>#</th>
                                                <th>Title / Version</th>
                                                <th>Artist(s)</th>
                                                <th>Credits</th>
                                                <th>Metadata</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {form.tracks.map((track, idx) => (
                                                <tr key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>
                                                        <strong>{track.title}</strong>
                                                        {track.version && <div className="text-muted">({track.version})</div>}
                                                    </td>
                                                    <td>
                                                        {track.artists && track.artists.length > 0 ? track.artists.join(", ") : <span className="text-danger">Missing</span>}
                                                    </td>
                                                    <td>
                                                        <div><strong>C:</strong> {track.composer || '-'}</div>
                                                        <div><strong>P:</strong> {track.producer || '-'}</div>
                                                        <div><strong>L:</strong> {track.lyricist || '-'}</div>
                                                    </td>
                                                    <td>
                                                        <div>ISRC: {track.isrc || 'Auto'}</div>
                                                        <div>Explicit: {track.explicit ? 'Yes' : 'No'}</div>
                                                        <div>Lyrics: {track.lyrics ? 'Yes (Text)' : track.lyricsFile ? 'Yes (File)' : 'No'}</div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="d-flex justify-content-end mt-5">
                        <button
                            className={`mainBtn ${(!isDirty && isEdit) ? 'bgGray' : 'bgPurple'} clWhite`}
                            onClick={handleSubmit}
                            disabled={!isDirty && isEdit}
                            style={{ cursor: (!isDirty && isEdit) ? 'not-allowed' : 'pointer' }}
                            title={(!isDirty && isEdit) ? "No changes detected" : ""}
                        >
                            {isEdit ? 'Update Release' : 'Complete Release'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Step5Review;
