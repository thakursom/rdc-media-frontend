import React from 'react'

function AddLabelComponent() {
    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="add-subLabel-sec">
                    <div className="add-subLab">
                        <div className="add-subLabel-heading">
                            <h6>Add Sub Labels</h6>
                        </div>
                    </div>
                    <div className="add-subLabel-mainbox">
                        <div className="add-subLabel-box">
                            <form className="add-subLabels-form">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="form-group add-sublab-group">
                                            <label className="form-label" htmlFor="name">
                                                Name
                                            </label>
                                            <input
                                                className="form-control"
                                                type="text"
                                                id="name"
                                                placeholder="User"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group add-sublab-group">
                                            <label className="form-label" htmlFor="email">
                                                Email
                                            </label>
                                            <input
                                                className="form-control"
                                                type="email"
                                                id="email"
                                                placeholder="user@gmail.com"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-12">
                                        <div className="form-group add-sublab-group">
                                            <label className="form-label" htmlFor="country">
                                                Country
                                            </label>
                                            <select id="country" className="form-select">
                                                <option value="India">India</option>
                                                <option value="Nepal">Nepal</option>
                                                <option value="Sri Lanks">Sri Lanks</option>
                                                <option value="Pakistan">Pakistan</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group add-sublab-group">
                                            <label className="form-label" htmlFor="password">
                                                Password
                                            </label>
                                            <input className="form-control" type="password" id="password" />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group add-sublab-group">
                                            <label className="form-label" htmlFor="confirmPassword">
                                                Confirm Password
                                            </label>
                                            <input
                                                className="form-control"
                                                type="password"
                                                id="confirmPassword"
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group add-sublab-group">
                                            <button className="btn request-btn" id="requestBtn">
                                                Request
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}

export default AddLabelComponent
