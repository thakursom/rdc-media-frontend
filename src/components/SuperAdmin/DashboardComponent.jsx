import React from 'react'

function DashboardComponent() {
    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="container-fluid">
                    <section className="streaming">
                        <div className="row">
                            <div className="col-sm-12 col-md-12 col-lg-12 col-xxl-9 Stream-col">
                                <div className="chart-content chart-content-first">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h6>Streaming Performance</h6>
                                        <div className="selectBox">
                                            <select id="streaming-performance">
                                                <option value="All">All</option>
                                            </select>
                                            <select id="select-days">
                                                <option value="Sort By">Sort By</option>
                                            </select>
                                            <i className="fa fa-ellipsis-h" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="streams">
                                        <h6>
                                            20,161 Streams <span className="value1">+4,882 (34%)</span>
                                            <span className="content"> vs. previous 7 days</span>
                                        </h6>
                                    </div>
                                    <div className="chart-container">
                                        <canvas id="streamsChart" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-12 col-lg-12 col-xxl-3 Stream-col">
                                <div className="chart-content">
                                    <div className="main d-flex justify-content-between align-items-center">
                                        <h6>Top Releases</h6>
                                        <div className="selectBox">
                                            <select id="top-rlease">
                                                <option value="All">All</option>
                                            </select>
                                            <select id="artist-time">
                                                <option value="Sort By">Sort By</option>
                                            </select>
                                            <i className="fa fa-ellipsis-h" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="releases-main-content mt-2">
                                        <div className="content d-flex align-items-start gap-5 mt-2">
                                            <p>1</p>
                                            <div className="artist-data">
                                                <h6>CAT0084 - Demo Releas 84</h6>
                                                <p>R Artist 5</p>
                                            </div>
                                        </div>
                                        <div className="content d-flex align-items-start gap-5 mt-2">
                                            <p>2</p>
                                            <div className="artist-data">
                                                <h6>CAT0090 - Demo Releas 90</h6>
                                                <p>R Artist 5</p>
                                            </div>
                                        </div>
                                        <div className="content d-flex align-items-start gap-5 mt-2">
                                            <p>3</p>
                                            <div className="artist-data">
                                                <h6>CAT0085 - Demo Releas 85</h6>
                                                <p>R Artist 5</p>
                                            </div>
                                        </div>
                                        <div className="content d-flex align-items-start gap-5 mt-2">
                                            <p>4</p>
                                            <div className="artist-data">
                                                <h6>CAT0074 - Demo Releas 74</h6>
                                                <p>R Artist 5</p>
                                            </div>
                                        </div>
                                        <div className="content d-flex align-items-start gap-5 mt-2">
                                            <p>5</p>
                                            <div className="artist-data">
                                                <h6>CAT0034 - Demo Releas 34</h6>
                                                <p>R Artist 5</p>
                                            </div>
                                        </div>
                                        <div className="content d-flex align-items-start gap-5 mt-2">
                                            <p>6</p>
                                            <div className="artist-data">
                                                <h6>CAT0034 - Demo Releas 34</h6>
                                                <p>R Artist 5</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="charts-section">
                        <div className="row">
                            <div className="col-sm-12 col-md-6 col-xxl-3 Stream-col">
                                <div className="charts chart-content  mt-3">
                                    <div className="inner-content d-flex justify-content-between align-items-center">
                                        <h6>Top Artist</h6>
                                        <div className="selectBox">
                                            <select id="Top-Artist">
                                                <option value="All">All</option>
                                            </select>
                                            <select id="Artist-time">
                                                <option value="Sort By">Sort By</option>
                                            </select>
                                            <i className="fa fa-ellipsis-h" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="chartMainBox">
                                        <canvas id="myChart" />
                                    </div>
                                    <div className="top-artist d-flex justify-content-between align-items-center flex-wrap">
                                        <div className="main-content">
                                            <ul>
                                                <li>
                                                    <span>Artist</span>
                                                    <h6>David doe</h6>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="main-content">
                                            <ul>
                                                <li>
                                                    <span>Streaming</span>
                                                    <h6>300,168.69</h6>
                                                </li>
                                            </ul>
                                        </div>
                                        <div className="main-content">
                                            <ul>
                                                <li>
                                                    <span>Percentage</span>
                                                    <h6>(60%)</h6>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-xxl-3 Stream-col">
                                <div className="chart-content charts mt-4">
                                    <div className="inner-content d-flex justify-content-between align-items-center">
                                        <h6>Top Languages</h6>
                                        <div className="selectBox">
                                            <select id="Top-Territories">
                                                <option value="All">All</option>
                                            </select>
                                            <select id="Territories-days">
                                                <option value="Sort By">Sort By</option>
                                            </select>
                                            <i className="fa fa-ellipsis-h" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div
                                        className="peiChart"
                                        style={{ width: "50%", maxWidth: 400, margin: "15px auto" }}
                                    >
                                        <canvas id="myPieChart" />
                                    </div>
                                    <div className="country-data">
                                        <div className="teritory-deta d-flex justify-content-between align-items-start">
                                            <div className="country">
                                                <ul>
                                                    <li>
                                                        <span>English</span>
                                                        <p>$547,78.69</p>
                                                    </li>
                                                </ul>
                                            </div>
                                            <h6>(60%)</h6>
                                        </div>
                                        <div className="teritory-deta d-flex justify-content-between align-items-start">
                                            <div className="country">
                                                <ul>
                                                    <li>
                                                        <span>Spanish</span>
                                                        <p>$547,78.69</p>
                                                    </li>
                                                </ul>
                                            </div>
                                            <h6>(50%)</h6>
                                        </div>
                                        <div className="teritory-deta d-flex justify-content-between align-items-start">
                                            <div className="country">
                                                <ul>
                                                    <li>
                                                        <span>Spanish</span>
                                                        <p>$547,78.69</p>
                                                    </li>
                                                </ul>
                                            </div>
                                            <h6>(40%)</h6>
                                        </div>
                                        <div className="teritory-deta d-flex justify-content-between align-items-start">
                                            <div className="country">
                                                <ul>
                                                    <li>
                                                        <span>French</span>
                                                        <p>$547,78.69</p>
                                                    </li>
                                                </ul>
                                            </div>
                                            <h6>(30%)</h6>
                                        </div>
                                        <div className="teritory-deta d-flex justify-content-between align-items-start">
                                            <div className="country">
                                                <ul>
                                                    <li>
                                                        <span>Other</span>
                                                        <p>$547,78.69</p>
                                                    </li>
                                                </ul>
                                            </div>
                                            <h6>(80%)</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-xxl-3 Stream-col">
                                <div className="chart-content charts mt-4">
                                    <div className="inner-content d-flex justify-content-between align-items-center">
                                        <h6>Top Streaming Platform</h6>
                                        <div className="selectBox">
                                            <select id="Streaming-brands">
                                                <option value="All">All</option>
                                            </select>
                                            <select id="Streaming-time">
                                                <option value="Sort By">Sort By</option>
                                            </select>
                                            <i className="fa fa-ellipsis-h" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="verticalBar">
                                        <canvas id="customBarChart" />
                                    </div>
                                    <div className="country-data">
                                        <div className="teritory-deta d-flex justify-content-between align-items-start">
                                            <div className="country">
                                                <ul>
                                                    <li>
                                                        <span>$547,78.69</span>
                                                        <p>$547,78.69(60%)</p>
                                                    </li>
                                                </ul>
                                            </div>
                                            <h6>(60%)</h6>
                                        </div>
                                        <div className="teritory-deta d-flex justify-content-between align-items-start">
                                            <div className="country">
                                                <ul>
                                                    <li>
                                                        <span>Label Store</span>
                                                        <p>$547,78.69</p>
                                                    </li>
                                                </ul>
                                            </div>
                                            <h6>(40%)</h6>
                                        </div>
                                        <div className="teritory-deta d-flex justify-content-between align-items-start">
                                            <div className="country">
                                                <ul>
                                                    <li>
                                                        <span>iTunes</span>
                                                        <p>$49,310.26</p>
                                                    </li>
                                                </ul>
                                            </div>
                                            <h6>(20%)</h6>
                                        </div>
                                        <div className="teritory-deta d-flex justify-content-between align-items-start">
                                            <div className="country">
                                                <ul>
                                                    <li>
                                                        <span>iTunes Streaming (Apple Music)</span>
                                                        <p>$35,310.26</p>
                                                    </li>
                                                </ul>
                                            </div>
                                            <h6>(30%)</h6>
                                        </div>
                                        <div className="teritory-deta d-flex justify-content-between align-items-start">
                                            <div className="country">
                                                <ul>
                                                    <li>
                                                        <span>Other</span>
                                                        <p>$80,310.26</p>
                                                    </li>
                                                </ul>
                                            </div>
                                            <h6>(50%)</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-xxl-3 Stream-col">
                                <div className="chart-content charts mt-4">
                                    <div className="inner-content d-flex justify-content-between align-items-center">
                                        <h6>Top Genre</h6>
                                        <div className="selectBox">
                                            <select id="topGenre">
                                                <option value="All">All</option>
                                            </select>
                                            <select id="genreTime">
                                                <option value="Sort By">Sort By</option>
                                            </select>
                                            <i className="fa fa-ellipsis-h" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="doughnut">
                                        <canvas id="doughnutChart" />
                                    </div>
                                    <div className="country-data">
                                        <div className="teritory-deta d-flex justify-content-between align-items-start">
                                            <div className="country">
                                                <ul>
                                                    <li>
                                                        <span>Rock</span>
                                                        <p>$547,78.69(60%)</p>
                                                    </li>
                                                </ul>
                                            </div>
                                            <h6>(60%)</h6>
                                        </div>
                                        <div className="teritory-deta d-flex justify-content-between align-items-start">
                                            <div className="country">
                                                <ul>
                                                    <li>
                                                        <span>Pop Music</span>
                                                        <p>$547,78.69</p>
                                                    </li>
                                                </ul>
                                            </div>
                                            <h6>(50%)</h6>
                                        </div>
                                        <div className="teritory-deta d-flex justify-content-between align-items-start">
                                            <div className="country">
                                                <ul>
                                                    <li>
                                                        <span>Rhythm and blues</span>
                                                        <p>$49,310.26</p>
                                                    </li>
                                                </ul>
                                            </div>
                                            <h6>(40%)</h6>
                                        </div>
                                        <div className="teritory-deta d-flex justify-content-between align-items-start">
                                            <div className="country">
                                                <ul>
                                                    <li>
                                                        <span>Heavy Metal</span>
                                                        <p>$35,310.26</p>
                                                    </li>
                                                </ul>
                                            </div>
                                            <h6>(30%)</h6>
                                        </div>
                                        <div className="teritory-deta d-flex justify-content-between align-items-start">
                                            <div className="country">
                                                <ul>
                                                    <li>
                                                        <span>Other</span>
                                                        <p>$80,310.26</p>
                                                    </li>
                                                </ul>
                                            </div>
                                            <h6>(80%)</h6>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="latest-releases-section">
                        <div className="row">
                            <div className="col-md-12 col-lg-12 col-xxl-9 Stream-col">
                                <div className="chart-content imageBox-section mt-4">
                                    <div className="latest-releas d-flex justify-content-between align-items-center gap-3">
                                        <h6>Latest Releases</h6>
                                        <div className="selectBox">
                                            <select id="labels">
                                                <option value="">All Labels</option>
                                            </select>
                                            <i className="fa fa-ellipsis-h" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className=" col-12 col-sm-4 col-md-3 col-lg-3 col-xl-2">
                                            <div className="imageBox d-flex justify-content-start flex-column  gap-2">
                                                <div className="imgbox">
                                                    <img src="../assets/Img/02.png" alt="" />
                                                </div>
                                                <div className="img-content">
                                                    <h6>The Infiniti</h6>
                                                    <p>Simth Jonas</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" col-12 col-sm-4 col-md-3 col-lg-3 col-xl-2">
                                            <div className="imageBox d-flex justify-content-start flex-column  gap-2">
                                                <div className="imgbox">
                                                    <img src="../assets/Img/05.png" alt="" />
                                                </div>
                                                <div className="img-content">
                                                    <h6>The Infiniti</h6>
                                                    <p>Simth Jonas</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" col-12 col-sm-4 col-md-3 col-lg-3 col-xl-2">
                                            <div className="imageBox d-flex justify-content-start flex-column  gap-2">
                                                <div className="imgbox">
                                                    <img src="../assets/Img/07.png" alt="" />
                                                </div>
                                                <div className="img-content">
                                                    <h6>The Infiniti</h6>
                                                    <p>Simth Jonas</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" col-12 col-sm-4 col-md-3 col-lg-3 col-xl-2">
                                            <div className="imageBox d-flex justify-content-start flex-column  gap-2">
                                                <div className="imgbox">
                                                    <img src="../assets/Img/08.png" alt="" />
                                                </div>
                                                <div className="img-content">
                                                    <h6>The Infiniti</h6>
                                                    <p>Simth Jonas</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" col-12 col-sm-4 col-md-3 col-lg-3 col-xl-2">
                                            <div className="imageBox d-flex justify-content-start flex-column  gap-2">
                                                <div className="imgbox">
                                                    <img src="../assets/Img/09.png" alt="" />
                                                </div>
                                                <div className="img-content">
                                                    <h6>The Infiniti</h6>
                                                    <p>Simth Jonas</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className=" col-12 col-sm-4 col-md-3 col-lg-3 col-xl-2">
                                            <div className="imageBox d-flex justify-content-start flex-column  gap-2">
                                                <div className="imgbox">
                                                    <img src="../assets/Img/27.png" alt="" />
                                                </div>
                                                <div className="img-content">
                                                    <h6>The Infiniti</h6>
                                                    <p>Simth Jonas</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-12 col-lg-12 col-xxl-3 Stream-col">
                                <div className="chart-content subLabel-section">
                                    <div className="sub-label d-flex justify-content-between align-items-center align-content-center gap-3">
                                        <h6>Sub Labels</h6>
                                        <div className="selectBox">
                                            <i className="fa fa-ellipsis-h" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="sub-label-artist">
                                        <div className="label-artist d-flex justify-content-between align-items-center ">
                                            <div className="artist d-flex justify-content-center align-items-center gap-3">
                                                <div className="artist-img">
                                                    <img src="../assets/Img/sidemenu/artist1.jpg" alt="not found" />
                                                </div>
                                                <div className="artist-content">
                                                    <h6>Smith Jonas</h6>
                                                    <p>smith@rdc.com</p>
                                                </div>
                                            </div>
                                            <h5>Artist</h5>
                                        </div>
                                        <div className="label-artist d-flex justify-content-between align-items-center ">
                                            <div className="artist d-flex justify-content-center align-items-center gap-3">
                                                <div className="artist-img">
                                                    <img src="../assets/Img/sidemenu/artist1.jpg" alt="not found" />
                                                </div>
                                                <div className="artist-content">
                                                    <h6>Allex William</h6>
                                                    <p>smith@rdc.com</p>
                                                </div>
                                            </div>
                                            <h5>Artist</h5>
                                        </div>
                                        <div className="label-artist d-flex justify-content-between align-items-center ">
                                            <div className="artist d-flex justify-content-center align-items-center gap-3">
                                                <div className="artist-img">
                                                    <img src="../assets/Img/sidemenu/artist1.jpg" alt="not found" />
                                                </div>
                                                <div className="artist-content">
                                                    <h6>Neha Arena</h6>
                                                    <p>smith@rdc.com</p>
                                                </div>
                                            </div>
                                            <h5>Artist</h5>
                                        </div>
                                        <div className="label-artist d-flex justify-content-between align-items-center ">
                                            <div className="artist d-flex justify-content-center align-items-center gap-3">
                                                <div className="artist-img">
                                                    <img src="../assets/Img/sidemenu/artist1.jpg" alt="not found" />
                                                </div>
                                                <div className="artist-content">
                                                    <h6>Haul Josh</h6>
                                                    <p>smith@rdc.com</p>
                                                </div>
                                            </div>
                                            <h5>Artist</h5>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </section>

        </>
    )
}

export default DashboardComponent
