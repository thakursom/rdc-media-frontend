import React from 'react';

const Step3Schedule = ({ form, update, showError }) => {
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
                                        className={`card-option ${form.priorityDistribution ? 'border-primary' : ''}`}
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
                                        className={`card-option ${!form.priorityDistribution ? 'border-primary' : ''}`}
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
                            <div className="btn-group castBtnSet">
                                <button
                                    className={`btn ${form.countryRestrictions === 'Yes' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => update('countryRestrictions', 'Yes')}
                                    type="button"
                                >
                                    Yes
                                </button>
                                <button
                                    className={`btn ${form.countryRestrictions === 'No' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => update('countryRestrictions', 'No')}
                                    type="button"
                                >
                                    No
                                </button>
                            </div>

                            {/* Error message for country restrictions */}
                            {showError('countryRestrictions')}
                        </div>

                        <div className="mb-4">
                            <label>Has this been released before?</label>
                            <div className="btn-group castBtnSet">
                                <button
                                    className={`btn ${form.previouslyReleased === 'Yes' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => update('previouslyReleased', 'Yes')}
                                    type="button"
                                >
                                    Yes
                                </button>
                                <button
                                    className={`btn ${form.previouslyReleased === 'No' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => update('previouslyReleased', 'No')}
                                    type="button"
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
