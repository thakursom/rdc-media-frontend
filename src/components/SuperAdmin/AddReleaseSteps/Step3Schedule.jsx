import React, { useState } from 'react';

const Step3Schedule = ({ form, update, showError, countries = [] }) => {
    const [searchTerm, setSearchTerm] = useState('');
    return (
        <>
            <div className="main-sec-heading pb-5">
                <h2>Plan Your Release</h2>
            </div>
            <div className='p-5'>
                <div className="card plan-releas-main">
                    <div className="card-body">
                        <div className="rounded mb-4 bg-white">
                            <label className="form-label required choose-rel-date">
                                Choose a release date
                            </label>
                            <input
                                type="date"
                                className="form-control mb-3 pickDate"
                                value={form.releaseDate || ""}
                                onChange={(e) => update('releaseDate', e.target.value)}
                                min={new Date().toISOString().split('T')[0]} // optional: prevent past dates in picker
                            />

                            {/* Error message for release date */}
                            {showError('releaseDate')}

                            <div className="row mt-4">
                                <div className="col-md-6">
                                    <div
                                        className={`card-option ${form.priorityDistribution ? 'border-purple shadow-sm' : ''}`}
                                        onClick={() => update('priorityDistribution', true)}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="me-3">
                                                <strong>Priority Distribution</strong>
                                                <p className="small mb-0">Get your music to stores faster (+₹5,000)</p>
                                            </div>
                                            <input
                                                type="radio"
                                                name="distro"
                                                checked={form.priorityDistribution === true}
                                                onChange={() => update('priorityDistribution', true)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div
                                        className={`card-option ${!form.priorityDistribution ? 'border-purple shadow-sm' : ''}`}
                                        onClick={() => update('priorityDistribution', false)}
                                    >
                                        <div className="d-flex align-items-center">
                                            <div className="me-3">
                                                <strong>Standard Distribution</strong>
                                                <p className="small mb-0">Included</p>
                                            </div>
                                            <input
                                                type="radio"
                                                name="distro"
                                                checked={form.priorityDistribution === false}
                                                onChange={() => update('priorityDistribution', false)}
                                                onClick={(e) => e.stopPropagation()}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Optional: show error if you decide to make it required */}
                            {/* {showError('priorityDistribution')} */}
                        </div>

                        <div className="mb-4">
                            <label>Would you like to add country restrictions?</label>
                            <div className="btn-group castBtnSet mb-3 d-flex" style={{ maxWidth: '200px' }}>
                                <button
                                    className={`btn flex-fill ${form.countryRestrictions === 'Yes' ? 'bgPurple clWhite' : 'btn-outline-secondary'}`}
                                    onClick={() => update('countryRestrictions', 'Yes')}
                                    type="button"
                                    style={{ height: '40px' }}
                                >
                                    Yes
                                </button>
                                <button
                                    className={`btn flex-fill ${form.countryRestrictions === 'No' ? 'bgPurple clWhite' : 'btn-outline-secondary'}`}
                                    onClick={() => update('countryRestrictions', 'No')}
                                    type="button"
                                    style={{ height: '40px' }}
                                >
                                    No
                                </button>
                            </div>

                            {form.countryRestrictions === 'Yes' && (() => {
                                const filteredCountries = (countries || []).filter(c => 
                                    !searchTerm || 
                                    c.countryName.toLowerCase().includes(searchTerm) || 
                                    c.countryCode.toLowerCase().includes(searchTerm)
                                );
                                const allSelected = filteredCountries.length > 0 && filteredCountries.every(c => 
                                    (form.countryRestrictionsList || []).includes(c.countryName)
                                );
                                
                                return (
                                <div className="mt-3 country-restriction-sec border rounded p-3 bg-light">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="search-box" style={{ maxWidth: '300px', flex: 1 }}>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Search country..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                                            />
                                        </div>
                                    </div>

                                    <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        <table className="table table-sm table-hover bg-white">
                                            <thead className="sticky-top bg-white">
                                                <tr>
                                                    <th style={{ width: '40px' }} className="text-center">
                                                        <input
                                                            type="checkbox"
                                                            checked={allSelected}
                                                            onChange={(e) => {
                                                                const currentList = form.countryRestrictionsList || [];
                                                                if (e.target.checked) {
                                                                    const newNames = filteredCountries.map(c => c.countryName);
                                                                    const combined = Array.from(new Set([...currentList, ...newNames]));
                                                                    update('countryRestrictionsList', combined);
                                                                } else {
                                                                    const filteredNames = filteredCountries.map(c => c.countryName);
                                                                    update('countryRestrictionsList', currentList.filter(name => !filteredNames.includes(name)));
                                                                }
                                                            }}
                                                        />
                                                    </th>
                                                    <th>Title</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredCountries.map((country) => (
                                                    <tr key={country._id} onClick={() => {
                                                        const currentList = form.countryRestrictionsList || [];
                                                        const nextList = currentList.includes(country.countryName)
                                                            ? currentList.filter(name => name !== country.countryName)
                                                            : [...currentList, country.countryName];
                                                        update('countryRestrictionsList', nextList);
                                                    }} style={{ cursor: 'pointer' }}>
                                                        <td className="text-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={(form.countryRestrictionsList || []).includes(country.countryName)}
                                                                readOnly
                                                            />
                                                        </td>
                                                        <td>{country.countryName} ({country.countryCode})</td>
                                                    </tr>
                                                ))}
                                                {filteredCountries.length === 0 && (
                                                    <tr>
                                                        <td colSpan="2" className="text-center text-muted">No countries found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="mt-2 small text-muted">
                                        { (form.countryRestrictionsList || []).length } countries selected
                                    </div>
                                </div>
                            )})()}

                            {/* Error message for country restrictions */}
                            {showError('countryRestrictions')}
                        </div>

                        <div className="mb-4">
                            <label>Has this been released before?</label>
                            <div className="btn-group castBtnSet d-flex" style={{ maxWidth: '200px' }}>
                                <button
                                    className={`btn flex-fill ${form.previouslyReleased === 'Yes' ? 'bgPurple clWhite' : 'btn-outline-secondary'}`}
                                    onClick={() => update('previouslyReleased', 'Yes')}
                                    type="button"
                                    style={{ height: '40px' }}
                                >
                                    Yes
                                </button>
                                <button
                                    className={`btn flex-fill ${form.previouslyReleased === 'No' ? 'bgPurple clWhite' : 'btn-outline-secondary'}`}
                                    onClick={() => update('previouslyReleased', 'No')}
                                    type="button"
                                    style={{ height: '40px' }}
                                >
                                    No
                                </button>
                            </div>

                            {/* Error message for previously released */}
                            {showError('previouslyReleased')}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Step3Schedule;
