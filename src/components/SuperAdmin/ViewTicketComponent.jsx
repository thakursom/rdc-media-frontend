import React from 'react'

function ViewTicketComponent() {
    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="Audio-main-sec">
                    <div className="view-release">
                        <div className="view-release-heading">
                            <h6>View Ticket</h6>
                        </div>
                    </div>
                    <form className="view-ticket-form">
                        <div className="form-group view-ticket-group">
                            <label htmlFor="status">Status</label>
                            <select id="status">
                                <option value="status">status</option>
                            </select>
                        </div>
                    </form>
                    <div className="viewReleases-main-sec audio-sec">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>Title / Artist</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="Title-artist-td view-ticket-artist-td">
                                        <h6>The Girl</h6>
                                        <p>Smith Jones</p>
                                    </td>
                                    <td className="view-ticket-pra">
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                            seiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </td>
                                    <td className="excel-button view-ticket-btn">
                                        <button className="btn excel" id="ticketNew">
                                            New
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="Title-artist-td view-ticket-artist-td">
                                        <h6>The Girl</h6>
                                        <p>Smith Jones</p>
                                    </td>
                                    <td className="view-ticket-pra">
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                            seiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </td>
                                    <td className="excel-button view-ticket-btn">
                                        <button className="btn excel" id="ticketNew">
                                            New
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="Title-artist-td view-ticket-artist-td">
                                        <h6>The Girl</h6>
                                        <p>Smith Jones</p>
                                    </td>
                                    <td className="view-ticket-pra">
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                            seiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </td>
                                    <td className="excel-button view-ticket-btn">
                                        <button className="btn excel" id="ticketNew">
                                            New
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="Title-artist-td view-ticket-artist-td">
                                        <h6>The Girl</h6>
                                        <p>Smith Jones</p>
                                    </td>
                                    <td className="view-ticket-pra">
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                            seiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </td>
                                    <td className="excel-button view-ticket-btn">
                                        <button className="btn excel" id="ticketComplete">
                                            Complete
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="Title-artist-td view-ticket-artist-td">
                                        <h6>The Girl</h6>
                                        <p>Smith Jones</p>
                                    </td>
                                    <td className="view-ticket-pra">
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                            seiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </td>
                                    <td className="excel-button view-ticket-btn">
                                        <button className="btn excel" id="ticketComplete">
                                            Complete
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="Title-artist-td view-ticket-artist-td">
                                        <h6>The Girl</h6>
                                        <p>Smith Jones</p>
                                    </td>
                                    <td className="view-ticket-pra">
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                            seiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </td>
                                    <td className="excel-button view-ticket-btn">
                                        <button className="btn excel" id="ticketComplete">
                                            Complete
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="Title-artist-td view-ticket-artist-td">
                                        <h6>The Girl</h6>
                                        <p>Smith Jones</p>
                                    </td>
                                    <td className="view-ticket-pra">
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                            seiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </td>
                                    <td className="excel-button view-ticket-btn">
                                        <button className="btn excel" id="ticketProgress">
                                            Progress
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="Title-artist-td view-ticket-artist-td">
                                        <h6>The Girl</h6>
                                        <p>Smith Jones</p>
                                    </td>
                                    <td className="view-ticket-pra">
                                        <p>
                                            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                                            seiusmod tempor incididunt ut labore et dolore magna aliqua.
                                        </p>
                                    </td>
                                    <td className="excel-button view-ticket-btn">
                                        <button className="btn excel" id="ticketProgress">
                                            Progress
                                        </button>
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

export default ViewTicketComponent
