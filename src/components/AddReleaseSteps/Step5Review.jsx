import React from 'react';

const Step5Review = ({ form, handleSubmit, genres, subGenres, languages }) => {
    // Helper to find name by ID
    const getLanguageName = (id) => {
        const lang = languages?.find(l => l.id == id);
        return lang ? lang.name : id || '(not set)';
    };

    const getGenreName = (id) => {
        const g = genres?.find(g => g.id == id);
        return g ? g.name : id || '(not set)';
    };

    const getSubGenreName = (id) => {
        const sg = subGenres?.find(s => s.id == id);
        return sg ? sg.name : id || '-';
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
                                        <th>Primary Artist</th>
                                        <td>{form.releaseArtists[0] || '(not set)'}</td>
                                    </tr>
                                    <tr>
                                        <th>Release Date</th>
                                        <td>{form.releaseDate || '(not set)'}</td>
                                    </tr>
                                    <tr>
                                        <th>Stores</th>
                                        <td>{form.selectedStores.join(', ') || 'None selected'}</td>
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
                        <button className="btn bgGreen clWhite btn-lg px-5" onClick={handleSubmit}>
                            Complete Release
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Step5Review;
