import React from 'react'

function AddBulkReleaseComponent() {
    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="bulk-releases-section">
                    <div className="bulk-sec-heading">
                        <h6>Add Bulk Releases</h6>
                    </div>
                    <div className="bulk-file-sec">
                        <div className="bulk-rel-guidlines">
                            <h6>Please follow the guidelines included in the files</h6>
                            <p>Do not try to alter the template in any way</p>
                            <p>(i.e.: by adding or removing columns or changing columns titles)</p>
                            <p>Your file is completed? Upload it.</p>
                        </div>
                        <div className="row">
                            <div className=" col-sm-12 col-md-6 col-lg-6 col-xl-6 col-xxl-6">
                                <div className="choose-bulk-mainbox">
                                    <div className="file-icon">
                                        <i className="fa-solid fa-plus" />
                                    </div>
                                    <h5>
                                        Upload zip files containing audio assets, artwork and matadata
                                    </h5>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bulk-metadata">
                        <div className="metadata-head">
                            <h6>
                                Select our Excel metadata template and complete it with your releases'
                                data:
                            </h6>
                        </div>
                        <ul className="metadata-menu">
                            <li>
                                <span className="align-li">
                                    <a href="#">
                                        Album - extended (Audio / Apple video) <span>Download</span>
                                    </a>
                                </span>
                            </li>
                            <li>
                                <span className="align-li">
                                    <a href="#">
                                        Classical (Opera) <span>Download</span>
                                    </a>
                                </span>
                            </li>
                            <li>
                                <span className="align-li">
                                    <a href="#">
                                        Classical (other) <span>Download</span>
                                    </a>
                                </span>
                            </li>
                            <li>
                                <span className="align-li">
                                    <a href="#">
                                        Jazz <span>Download</span>
                                    </a>
                                </span>
                            </li>
                            <li>
                                <span className="align-li">
                                    <a href="#">
                                        Music Video <span>Download</span>
                                    </a>
                                </span>
                            </li>
                            <li>
                                <span className="align-li">
                                    <a href="#">
                                        Entertainment Video <span>Download</span>
                                    </a>
                                </span>
                            </li>
                        </ul>
                        <p>See your video Channels resume</p>
                    </div>
                </div>
            </section>
        </>
    )
}

export default AddBulkReleaseComponent