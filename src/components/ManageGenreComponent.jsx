import React from 'react'

function ManageGenreComponent() {
    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="Audio-main-sec">
                    <div className="view-release">
                        <div className="view-release-heading">
                            <h6>Manage Genre</h6>
                        </div>
                        <div className="manage-genre-btn">
                            <button
                                className="btn mangageGenre"
                                data-bs-toggle="modal"
                                data-bs-target="#saveFilter"
                            >
                                <i className="fa-solid fa-plus" />
                                Add New
                            </button>
                        </div>
                    </div>
                    <div className="viewReleases-main-sec audio-sec">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>Genre Name</th>
                                    <th>Genre Description</th>
                                    <th>Genre Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>1</td>
                                    <td>Smith</td>
                                    <td className="news-pra">
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </td>
                                    <td className="genreStatus">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue=""
                                                id="flexCheckDefault"
                                            />
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Disabled
                                            </label>
                                        </div>
                                    </td>
                                    <td
                                        className="excel-button view-subLabels-btn manageGenre"
                                        id="subLabelsBtn"
                                    >
                                        <div className="manage-gen-btnBox">
                                            <button className="btn excel" id="subLabelsBtn">
                                                Edit
                                            </button>
                                            <button className="btn excel" id="subLabelsDel">
                                                Deleted
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>2</td>
                                    <td>Smith</td>
                                    <td className="news-pra">
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </td>
                                    <td>India</td>
                                    <td
                                        className="excel-button view-subLabels-btn manageGenre"
                                        id="subLabelsBtn"
                                    >
                                        <div className="manage-gen-btnBox">
                                            <button className="btn excel" id="subLabelsBtn">
                                                Edit
                                            </button>
                                            <button className="btn excel" id="subLabelsDel">
                                                Deleted
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>3</td>
                                    <td>Smith</td>
                                    <td className="news-pra">
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </td>
                                    <td>India</td>
                                    <td
                                        className="excel-button view-subLabels-btn manageGenre"
                                        id="subLabelsBtn"
                                    >
                                        <div className="manage-gen-btnBox">
                                            <button className="btn excel" id="subLabelsBtn">
                                                Edit
                                            </button>
                                            <button className="btn excel" id="subLabelsDel">
                                                Deleted
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>4</td>
                                    <td>Smith</td>
                                    <td className="news-pra">
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </td>
                                    <td>India</td>
                                    <td
                                        className="excel-button view-subLabels-btn manageGenre"
                                        id="subLabelsBtn"
                                    >
                                        <div className="manage-gen-btnBox">
                                            <button className="btn excel" id="subLabelsBtn">
                                                Edit
                                            </button>
                                            <button className="btn excel" id="subLabelsDel">
                                                Deleted
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>5</td>
                                    <td>Smith</td>
                                    <td className="news-pra">
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </td>
                                    <td>India</td>
                                    <td
                                        className="excel-button view-subLabels-btn manageGenre"
                                        id="subLabelsBtn"
                                    >
                                        <div className="manage-gen-btnBox">
                                            <button className="btn excel" id="subLabelsBtn">
                                                Edit
                                            </button>
                                            <button className="btn excel" id="subLabelsDel">
                                                Deleted
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>6</td>
                                    <td>Smith</td>
                                    <td className="news-pra">
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </td>
                                    <td>India</td>
                                    <td
                                        className="excel-button view-subLabels-btn manageGenre"
                                        id="subLabelsBtn"
                                    >
                                        <div className="manage-gen-btnBox">
                                            <button className="btn excel" id="subLabelsBtn">
                                                Edit
                                            </button>
                                            <button className="btn excel" id="subLabelsDel">
                                                Deleted
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>7</td>
                                    <td>Smith</td>
                                    <td className="news-pra">
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </td>
                                    <td>India</td>
                                    <td
                                        className="excel-button view-subLabels-btn manageGenre"
                                        id="subLabelsBtn"
                                    >
                                        <div className="manage-gen-btnBox">
                                            <button className="btn excel" id="subLabelsBtn">
                                                Edit
                                            </button>
                                            <button className="btn excel" id="subLabelsDel">
                                                Deleted
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>8</td>
                                    <td>Smith</td>
                                    <td className="news-pra">
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                            eiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </td>
                                    <td>India</td>
                                    <td
                                        className="excel-button view-subLabels-btn manageGenre"
                                        id="subLabelsBtn"
                                    >
                                        <div className="manage-gen-btnBox">
                                            <button className="btn excel" id="subLabelsBtn">
                                                Edit
                                            </button>
                                            <button className="btn excel" id="subLabelsDel">
                                                Deleted
                                            </button>
                                        </div>
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

export default ManageGenreComponent