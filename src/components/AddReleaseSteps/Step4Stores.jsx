import React from 'react';

const Step4Stores = ({ form, update, errors, showError }) => {
    return (
        <>
            <div className="main-sec-heading pb-5"><h2>Select your stores</h2></div>
            <div className='px-5'>
                <div className="my-4">
                    <label className='mb-3'>How much would you like to charge for your track?</label>
                    <select
                        className="form-select w-auto"
                        value={form.pricing}
                        onChange={(e) => update('pricing', e.target.value)}
                    >
                        <option value="">Select pricing...</option>
                        <option value="budget">Budget</option>
                        <option value="mid">Mid-tier</option>
                        <option value="premium">Premium</option>
                    </select>
                    {showError('pricing')}
                </div>
                <div className="card">

                    <div className="card-body">


                        <h6 className='mb-3'>Select stores</h6>
                        <div className="row g-2 store-grid">
                            {[
                                'iTunes',
                                'Apple Music',
                                'Spotify',
                                'Amazon',
                                'YouTube Music',
                                'Tidal',
                                'Deezer',
                                'Napster',
                                'Pandora',
                                'TikTok',
                                // ... add more as needed
                            ].map((store) => (
                                <div key={store} className="col-4 col-md-3 col-lg-2">
                                    <div className="form-check store-item">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id={`store-${store}`}
                                            checked={form.selectedStores.includes(store)}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    update('selectedStores', [...form.selectedStores, store]);
                                                } else {
                                                    update(
                                                        'selectedStores',
                                                        form.selectedStores.filter((s) => s !== store)
                                                    );
                                                }
                                            }}
                                        />
                                        <label className="form-check-label small" htmlFor={`store-${store}`}>
                                            {store}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {showError('selectedStores')}

                        <div className="mt-4">
                            <label>Future and Upcoming Stores</label>
                            <div className="btn-group castBtnSet">
                                <button
                                    className={`btn ${form.futureStores === 'Yes' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => update('futureStores', 'Yes')}
                                >
                                    Yes, send me updates
                                </button>
                                <button
                                    className={`btn ${form.futureStores === 'No' ? 'btn-primary' : 'btn-outline-primary'}`}
                                    onClick={() => update('futureStores', 'No')}
                                >
                                    No
                                </button>
                            </div>
                            {showError('futureStores')}
                        </div>



                    </div>
                </div>
            </div>
        </>
    );
};

export default Step4Stores;
