import React from 'react'

function ViewAllReleaseComponent() {
    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="view-release-sec">
                    <div className="view-release">
                        <div className="view-release-heading">
                            <h6>View Releases</h6>
                        </div>
                        <div className="view-all-release-search">
                            <form>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="view_release-search"
                                        placeholder="Search by releases"
                                    />
                                    <div className="view-search-icon">
                                        <i className="fa-solid fa-magnifying-glass" />
                                    </div>
                                </div>
                            </form>
                            <button
                                className="btn vewReleaseBtn"
                                data-bs-toggle="modal"
                                data-bs-target="#advanceFilter"
                            >
                                <i className="fa-solid fa-plus" />
                                Advancesd
                            </button>
                            <div
                                className="modal fade advance-filter-modal"
                                id="advanceFilter"
                                data-bs-keyboard="false"
                                tabIndex={-1}
                                aria-labelledby="staticBackdropLabel"
                                aria-hidden="true"
                            >
                                <div className="modal-dialog">
                                    <div className="modal-content">
                                        <div className="modal-header">
                                            <h5 className="modal-title" id="staticBackdropLabel">
                                                Add Filters
                                            </h5>
                                            <button
                                                type="button"
                                                className="btn-close"
                                                data-bs-dismiss="modal"
                                            >
                                                <i className="fa-solid fa-xmark" />
                                            </button>
                                        </div>
                                        <div className="modal-body">
                                            <div className="product-info">
                                                <div className="product-info-heading">
                                                    <h6>Product Information</h6>
                                                </div>
                                                <form className="product-list">
                                                    <div className="row">
                                                        <div className="col-md-6">
                                                            <div className="product-mainbox">
                                                                <div className="product-mainbox-content">
                                                                    <div className="product-list-heading">
                                                                        <h6>Status</h6>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="music"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="music"
                                                                        >
                                                                            <span>Music</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="ringtone"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="ringtone"
                                                                        >
                                                                            <span>Ringtone</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="musicVideo"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="musicVideo"
                                                                        >
                                                                            <span>Music Video</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="packshot"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="packshot"
                                                                        >
                                                                            <span>Packshot Video</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="entain"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="entain"
                                                                        >
                                                                            <span>Entertainment Video</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="gaming"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="gaming"
                                                                        >
                                                                            <span>Gaming Video</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group product-field">
                                                                    <label className="form-label" htmlFor="label">
                                                                        Label
                                                                    </label>
                                                                    <input
                                                                        className="font-control"
                                                                        type="text"
                                                                        id="label"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6">
                                                            <div className="product-mainbox">
                                                                <div className="product-mainbox-content">
                                                                    <div className="product-list-heading">
                                                                        <h6>Status</h6>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="delivered"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="delivered"
                                                                        >
                                                                            <span>Delivered</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="product-review"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="product-review"
                                                                        >
                                                                            <span>
                                                                                {" "}
                                                                                This product is being reviewed by our content
                                                                                compliance team. In case of compliance issues
                                                                                with stores guidelines, we will contact you
                                                                                for resolution.{" "}
                                                                            </span>{" "}
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="correction"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="correction"
                                                                        >
                                                                            <span>Correction Requested</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="draft"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="draft"
                                                                        >
                                                                            <span>Draft</span>
                                                                        </label>
                                                                    </div>
                                                                    <div className="product-list-check form-check">
                                                                        <input
                                                                            className="form-check-input pro"
                                                                            type="checkbox"
                                                                            name="ar-cheack"
                                                                            defaultValue=""
                                                                            id="unsellable"
                                                                        />
                                                                        <label
                                                                            className="form-check-label"
                                                                            htmlFor="unsellable"
                                                                        >
                                                                            <span>Unsellable</span>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                                <div className="form-group product-field">
                                                                    <label className="form-label" htmlFor="artist">
                                                                        Artist
                                                                    </label>
                                                                    <input
                                                                        className="font-control"
                                                                        type="text"
                                                                        id="artist"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="account-info">
                                                <div className="account-info-heading">
                                                    <h6>Account Information</h6>
                                                </div>
                                                <form className="account-info-form">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group account-field">
                                                                <label className="form-label" htmlFor="user">
                                                                    User
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    id="user"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="period-sec">
                                                <div className="period-sec-heading">
                                                    <h6>Period</h6>
                                                </div>
                                                <form className="period-sec-form">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            <div className="form-group account-field label">
                                                                <label className="form-label" htmlFor="preDefined">
                                                                    Pre-Defined Period
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    id="preDefined"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-12 period-label account-field label">
                                                            <label className="form-label">Period :</label>
                                                        </div>
                                                        <div className="col-md-6 per-form account-field label">
                                                            <div className="form-group">
                                                                <label className="form-label" htmlFor="periodFrom">
                                                                    From
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    id="periodFrom"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="col-md-6 per-form account-field label">
                                                            <div className="form-group">
                                                                <label className="form-label" htmlFor="periodTo">
                                                                    To
                                                                </label>
                                                                <input
                                                                    className="form-control"
                                                                    type="text"
                                                                    id="periodTo"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <div className="source-info">
                                                        <div className="source-info-heading">
                                                            <h6>Source</h6>
                                                        </div>
                                                        <form className="product-list source-list">
                                                            <div className="product-mainbox-content">
                                                                <div className="product-list-check form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="checkbox"
                                                                        name="ar-cheack"
                                                                        defaultValue=""
                                                                        id="digital"
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="digital"
                                                                    >
                                                                        <span>Believe Digital</span>
                                                                    </label>
                                                                </div>
                                                                <div className="product-list-check form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="checkbox"
                                                                        name="ar-cheack"
                                                                        defaultValue=""
                                                                        id="transfer"
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="transfer"
                                                                    >
                                                                        <span>Catalog Transfer</span>
                                                                    </label>
                                                                </div>
                                                                <div className="product-list-check form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="checkbox"
                                                                        name="ar-cheack"
                                                                        defaultValue=""
                                                                        id="upload"
                                                                    />
                                                                    <label
                                                                        className="form-check-label"
                                                                        htmlFor="upload"
                                                                    >
                                                                        <span>Direct upload on Youtube</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
                                                    <div className="source-info">
                                                        <div className="source-info-heading">
                                                            <h6>Sort By</h6>
                                                        </div>
                                                        <form className="product-list source-list">
                                                            <div className="product-mainbox-content">
                                                                <div className="product-radio form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="radio"
                                                                        name="ar-cheack"
                                                                        defaultValue=""
                                                                        id="digital"
                                                                    />
                                                                    <label
                                                                        className="form-check-label pro-label"
                                                                        htmlFor="digital"
                                                                    >
                                                                        Release Title
                                                                    </label>
                                                                </div>
                                                                <div className="product-radio form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="radio"
                                                                        name="ar-cheack"
                                                                        defaultValue=""
                                                                        id="transfer"
                                                                    />
                                                                    <label
                                                                        className="form-check-label pro-label"
                                                                        htmlFor="transfer"
                                                                    >
                                                                        <span>Artist</span>
                                                                    </label>
                                                                </div>
                                                                <div className="product-radio form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="radio"
                                                                        name="ar-cheack"
                                                                        defaultValue=""
                                                                        id="upload"
                                                                    />
                                                                    <label
                                                                        className="form-check-label pro-label"
                                                                        htmlFor="upload"
                                                                    >
                                                                        <span>Label</span>
                                                                    </label>
                                                                </div>
                                                                <div className="product-radio form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="radio"
                                                                        name="ar-cheack"
                                                                        defaultValue=""
                                                                        id="upload"
                                                                    />
                                                                    <label
                                                                        className="form-check-label pro-label"
                                                                        htmlFor="upload"
                                                                    >
                                                                        <span>Creation Date</span>
                                                                    </label>
                                                                </div>
                                                                <div className="product-radio form-check">
                                                                    <input
                                                                        className="form-check-input pro"
                                                                        type="radio"
                                                                        name="ar-cheack"
                                                                        defaultValue=""
                                                                        id="upload"
                                                                    />
                                                                    <label
                                                                        className="form-check-label pro-label"
                                                                        htmlFor="upload"
                                                                    >
                                                                        <span>Release Date</span>
                                                                    </label>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="filter-buttons">
                                                <button className="btn cancel" id="cancelFilter">
                                                    Cancel
                                                </button>
                                                <button className="btn apply" id="applyFilter">
                                                    Apply Filters
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="viewReleases-main-sec">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Title / Artist</th>
                                    <th>Label</th>
                                    <th>Releas Data/Hour/Time/Zone </th>
                                    <th># Of track</th>
                                    <th>UPC / Catalogue Number</th>
                                    <th>Promotion</th>
                                    <th>Delievered Territories &amp; Store</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="text-color-dark">
                                        <span>Single</span>
                                    </td>
                                    <td>
                                        <div className="status-ok">
                                            <img src="../assets/Img/statusOk.png" alt="Not found" />
                                        </div>
                                    </td>
                                    <td className="Title-artist-td">
                                        <h6>The Girl</h6>
                                        <p>Smith Jones</p>
                                    </td>
                                    <td>Lalan Music</td>
                                    <td>11-02-2025/2hours/5:45/PM</td>
                                    <td>21 track</td>
                                    <td>
                                        <p className="upc-td">
                                            UPC :<span className="counts">456546464</span>{" "}
                                        </p>
                                        <p className="cat-td">
                                            Cat# :<span className="cat-count">$454</span>{" "}
                                        </p>
                                    </td>
                                    <td className="promote-td">Promote</td>
                                    <td className="icon-td">
                                        <div className="deliever-store-main">
                                            <div className="iconMain">
                                                <img src="../assets/Img/earth.png" alt="Not found" />
                                            </div>
                                            <p>240 terrs.</p>
                                        </div>
                                        <div className="deliever-store-main">
                                            <div className="iconMain">
                                                <img src="../assets/Img/file.png" alt="Not found" />
                                            </div>
                                            <p>0 Store.</p>
                                        </div>
                                    </td>
                                    <td className="download-content-btn">
                                        <button className="btn download-meta">Download Meta</button>
                                        <button className="btn download-audio">Download Audio</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-color-dark">
                                        <span>Album</span>
                                    </td>
                                    <td>
                                        <div className="status-ok">
                                            <img src="../assets/Img/status.png" alt="Not found" />
                                        </div>
                                    </td>
                                    <td className="Title-artist-td">
                                        <h6>The Girl</h6>
                                        <p>Smith Jones</p>
                                    </td>
                                    <td>Lalan Music</td>
                                    <td>11-02-2025/2hours/5:45/PM</td>
                                    <td>21 track</td>
                                    <td>
                                        <p className="upc-td">
                                            UPC :<span className="counts">456546464</span>{" "}
                                        </p>
                                        <p className="cat-td">
                                            Cat# :<span className="cat-count">$454</span>{" "}
                                        </p>
                                    </td>
                                    <td className="promote-td">Promote</td>
                                    <td className="icon-td">
                                        <div className="deliever-store-main">
                                            <div className="iconMain">
                                                <img src="../assets/Img/earth.png" alt="Not found" />
                                            </div>
                                            <p>240 terrs.</p>
                                        </div>
                                        <div className="deliever-store-main">
                                            <div className="iconMain">
                                                <img src="../assets/Img/file.png" alt="Not found" />
                                            </div>
                                            <p>0 Store.</p>
                                        </div>
                                    </td>
                                    <td className="download-content-btn">
                                        <button className="btn download-meta">Download Meta</button>
                                        <button className="btn download-audio">Download Audio</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-color-dark">
                                        <span>Single</span>
                                    </td>
                                    <td>
                                        <div className="status-ok">
                                            <img src="../assets/Img/statusOk.png" alt="Not found" />
                                        </div>
                                    </td>
                                    <td className="Title-artist-td">
                                        <h6>The Girl</h6>
                                        <p>Smith Jones</p>
                                    </td>
                                    <td>Lalan Music</td>
                                    <td>11-02-2025/2hours/5:45/PM</td>
                                    <td>21 track</td>
                                    <td>
                                        <p className="upc-td">
                                            UPC :<span className="counts">456546464</span>{" "}
                                        </p>
                                        <p className="cat-td">
                                            Cat# :<span className="cat-count">$454</span>{" "}
                                        </p>
                                    </td>
                                    <td className="promote-td">Promote</td>
                                    <td className="icon-td">
                                        <div className="deliever-store-main">
                                            <div className="iconMain">
                                                <img src="../assets/Img/earth.png" alt="Not found" />
                                            </div>
                                            <p>240 terrs.</p>
                                        </div>
                                        <div className="deliever-store-main">
                                            <div className="iconMain">
                                                <img src="../assets/Img/file.png" alt="Not found" />
                                            </div>
                                            <p>0 Store.</p>
                                        </div>
                                    </td>
                                    <td className="download-content-btn">
                                        <button className="btn download-meta">Download Meta</button>
                                        <button className="btn download-audio">Download Audio</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-color-dark">
                                        <span>Album</span>
                                    </td>
                                    <td>
                                        <div className="status-ok">
                                            <img src="../assets/Img/status.png" alt="Not found" />
                                        </div>
                                    </td>
                                    <td className="Title-artist-td">
                                        <h6>The Girl</h6>
                                        <p>Smith Jones</p>
                                    </td>
                                    <td>Lalan Music</td>
                                    <td>11-02-2025/2hours/5:45/PM</td>
                                    <td>21 track</td>
                                    <td>
                                        <p className="upc-td">
                                            UPC :<span className="counts">456546464</span>{" "}
                                        </p>
                                        <p className="cat-td">
                                            Cat# :<span className="cat-count">$454</span>{" "}
                                        </p>
                                    </td>
                                    <td className="promote-td">Promote</td>
                                    <td className="icon-td">
                                        <div className="deliever-store-main">
                                            <div className="iconMain">
                                                <img src="../assets/Img/earth.png" alt="Not found" />
                                            </div>
                                            <p>240 terrs.</p>
                                        </div>
                                        <div className="deliever-store-main">
                                            <div className="iconMain">
                                                <img src="../assets/Img/file.png" alt="Not found" />
                                            </div>
                                            <p>0 Store.</p>
                                        </div>
                                    </td>
                                    <td className="download-content-btn">
                                        <button className="btn download-meta">Download Meta</button>
                                        <button className="btn download-audio">Download Audio</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-color-dark">
                                        <span>Single</span>
                                    </td>
                                    <td>
                                        <div className="status-ok">
                                            <img src="../assets/Img/statusOk.png" alt="Not found" />
                                        </div>
                                    </td>
                                    <td className="Title-artist-td">
                                        <h6>The Girl</h6>
                                        <p>Smith Jones</p>
                                    </td>
                                    <td>Lalan Music</td>
                                    <td>11-02-2025/2hours/5:45/PM</td>
                                    <td>21 track</td>
                                    <td>
                                        <p className="upc-td">
                                            UPC :<span className="counts">456546464</span>{" "}
                                        </p>
                                        <p className="cat-td">
                                            Cat# :<span className="cat-count">$454</span>{" "}
                                        </p>
                                    </td>
                                    <td className="promote-td">Promote</td>
                                    <td className="icon-td">
                                        <div className="deliever-store-main">
                                            <div className="iconMain">
                                                <img src="../assets/Img/earth.png" alt="Not found" />
                                            </div>
                                            <p>240 terrs.</p>
                                        </div>
                                        <div className="deliever-store-main">
                                            <div className="iconMain">
                                                <img src="../assets/Img/file.png" alt="Not found" />
                                            </div>
                                            <p>0 Store.</p>
                                        </div>
                                    </td>
                                    <td className="download-content-btn">
                                        <button className="btn download-meta">Download Meta</button>
                                        <button className="btn download-audio">Download Audio</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-color-dark">
                                        <span>Single</span>
                                    </td>
                                    <td>
                                        <div className="status-ok">
                                            <img src="../assets/Img/statusOk.png" alt="Not found" />
                                        </div>
                                    </td>
                                    <td className="Title-artist-td">
                                        <h6>The Girl</h6>
                                        <p>Smith Jones</p>
                                    </td>
                                    <td>Lalan Music</td>
                                    <td>11-02-2025/2hours/5:45/PM</td>
                                    <td>21 track</td>
                                    <td>
                                        <p className="upc-td">
                                            UPC :<span className="counts">456546464</span>{" "}
                                        </p>
                                        <p className="cat-td">
                                            Cat# :<span className="cat-count">$454</span>{" "}
                                        </p>
                                    </td>
                                    <td className="promote-td">Promote</td>
                                    <td className="icon-td">
                                        <div className="deliever-store-main">
                                            <div className="iconMain">
                                                <img src="../assets/Img/earth.png" alt="Not found" />
                                            </div>
                                            <p>240 terrs.</p>
                                        </div>
                                        <div className="deliever-store-main">
                                            <div className="iconMain">
                                                <img src="../assets/Img/file.png" alt="Not found" />
                                            </div>
                                            <p>0 Store.</p>
                                        </div>
                                    </td>
                                    <td className="download-content-btn">
                                        <button className="btn download-meta">Download Meta</button>
                                        <button className="btn download-audio">Download Audio</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-color-dark">
                                        <span>Album</span>
                                    </td>
                                    <td>
                                        <div className="status-ok">
                                            <img src="../assets/Img/statusOk.png" alt="Not found" />
                                        </div>
                                    </td>
                                    <td className="Title-artist-td">
                                        <h6>The Girl</h6>
                                        <p>Smith Jones</p>
                                    </td>
                                    <td>Lalan Music</td>
                                    <td>11-02-2025/2hours/5:45/PM</td>
                                    <td>21 track</td>
                                    <td>
                                        <p className="upc-td">
                                            UPC :<span className="counts">456546464</span>{" "}
                                        </p>
                                        <p className="cat-td">
                                            Cat# :<span className="cat-count">$454</span>{" "}
                                        </p>
                                    </td>
                                    <td className="promote-td">Promote</td>
                                    <td className="icon-td">
                                        <div className="deliever-store-main">
                                            <div className="iconMain">
                                                <img src="../assets/Img/earth.png" alt="Not found" />
                                            </div>
                                            <p>240 terrs.</p>
                                        </div>
                                        <div className="deliever-store-main">
                                            <div className="iconMain">
                                                <img src="../assets/Img/file.png" alt="Not found" />
                                            </div>
                                            <p>0 Store.</p>
                                        </div>
                                    </td>
                                    <td className="download-content-btn">
                                        <button className="btn download-meta">Download Meta</button>
                                        <button className="btn download-audio">Download Audio</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-color-dark">
                                        <span>Album</span>
                                    </td>
                                    <td>
                                        <div className="status-ok">
                                            <img src="../assets/Img/statusOk.png" alt="Not found" />
                                        </div>
                                    </td>
                                    <td className="Title-artist-td">
                                        <h6>The Girl</h6>
                                        <p>Smith Jones</p>
                                    </td>
                                    <td>Lalan Music</td>
                                    <td>11-02-2025/2hours/5:45/PM</td>
                                    <td>21 track</td>
                                    <td>
                                        <p className="upc-td">
                                            UPC :<span className="counts">456546464</span>{" "}
                                        </p>
                                        <p className="cat-td">
                                            Cat# :<span className="cat-count">$454</span>{" "}
                                        </p>
                                    </td>
                                    <td className="promote-td">Promote</td>
                                    <td className="icon-td">
                                        <div className="deliever-store-main">
                                            <div className="iconMain">
                                                <img src="../assets/Img/earth.png" alt="Not found" />
                                            </div>
                                            <p>240 terrs.</p>
                                        </div>
                                        <div className="deliever-store-main">
                                            <div className="iconMain">
                                                <img src="../assets/Img/file.png" alt="Not found" />
                                            </div>
                                            <p>0 Store.</p>
                                        </div>
                                    </td>
                                    <td className="download-content-btn">
                                        <button className="btn download-meta">Download Meta</button>
                                        <button className="btn download-audio">Download Audio</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

        </>
    )
}

export default ViewAllReleaseComponent
