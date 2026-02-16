import React from 'react'

function CatalogueComponent() {
    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="catalogue-section">
                    <section className="catalougue-fliter">
                        <form className="cata-filter">
                            <div className="row">
                                <div className="col-3">
                                    <div className="cata-select-box">
                                        <select className="cata-select" id="cata_year">
                                            <option className="cata-option" value="Year">
                                                Year
                                            </option>
                                            <option value="All">All</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className="cata-select-box">
                                        <select className="cata-select" id="cata_year">
                                            <option className="cata-option" value="Year">
                                                Month
                                            </option>
                                            <option value="All">All</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className="cata-select-box">
                                        <select className="cata-select" id="cata_year">
                                            <option className="cata-option" value="Year">
                                                Data Range
                                            </option>
                                            <option value="1 Dec 2024 to 1 Jan 2025">
                                                1 Dec 24 - 1 Jan 25
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="col-3">
                                    <div className="cata-select-box">
                                        <select className="cata-select" id="cata_year">
                                            <option className="cata-option" value="Year">
                                                Services
                                            </option>
                                            <option value="All">All</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </section>
                    <section className="cata-total-visit">
                        <div className="row">
                            <div className="col-md-3">
                                <div className="cata-visit">
                                    <div className="cata-visit-heading">
                                        <h6>Total Albums</h6>
                                    </div>
                                    <div className="cata-main">
                                        <div className="cata-icon">
                                            <img src="../assets/Img/Total-albums.png" />
                                        </div>
                                        <div className="cata-content">
                                            <h5>546463</h5>
                                            <p>
                                                <span>60%</span>increase
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="cata-visit">
                                    <div className="cata-visit-heading">
                                        <h6>New Albums</h6>
                                    </div>
                                    <div className="cata-main">
                                        <div className="cata-icon">
                                            <img src="../assets/Img/New-albums.png" />
                                        </div>
                                        <div className="cata-content">
                                            <h5>6463</h5>
                                            <p>
                                                <span>50%</span>increase
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="cata-visit">
                                    <div className="cata-visit-heading">
                                        <h6>Unique Tracks</h6>
                                    </div>
                                    <div className="cata-main">
                                        <div className="cata-icon">
                                            <img src="../assets/Img/Unique-tracks.png" />
                                        </div>
                                        <div className="cata-content">
                                            <h5>2463</h5>
                                            <p>
                                                <span>40%</span>increase
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="cata-visit">
                                    <div className="cata-visit-heading">
                                        <h6>Total Number of Labels </h6>
                                    </div>
                                    <div className="cata-main">
                                        <div className="cata-icon">
                                            <img src="../assets/Img/Number-labels.png" />
                                        </div>
                                        <div className="cata-content">
                                            <h5>546463</h5>
                                            <p>
                                                <span>60%</span>increase
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className="charts-section">
                        <div className="row">
                            <div className="col-sm-12 col-md-6 col-xxl-4 Stream-col">
                                <div className="chart-content charts mt-4 ">
                                    <div className="inner-content d-flex justify-content-between align-items-center">
                                        <h6>Total Album</h6>
                                        <div className="selectBox">
                                            <select id="Territories-days">
                                                <option value="Sort By">Sort By</option>
                                                <option value="Sort By">7 days</option>
                                            </select>
                                            <select id="Top-Territories">
                                                <option value="All">Select Labels</option>
                                                <option value="All">All</option>
                                            </select>
                                            <i className="fa fa-ellipsis-h" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="catalogue-charts-main">
                                        <ol type={1} className="catalogue-chartbox">
                                            <div className="cataBox">
                                                <div className="catalogue-contentBox">
                                                    <div className="cata-chart-content">
                                                        <li>Thriller</li>
                                                        <p>CAT0084 - Demo Release 84</p>
                                                    </div>
                                                    <p>Album 10</p>
                                                </div>
                                                <div className="progress" style={{ height: 25 }}>
                                                    <div
                                                        className="progress-bar catalogue-progress"
                                                        role="progressbar"
                                                        style={{ width: "100%" }}
                                                        aria-valuenow={50}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    />
                                                </div>
                                            </div>
                                            <div className="cataBox">
                                                <div className="catalogue-contentBox">
                                                    <div className="cata-chart-content">
                                                        <li>The Dark Side of the Moon</li>
                                                        <p>CAT0084 - Demo Release 84</p>
                                                    </div>
                                                    <p>Album 10</p>
                                                </div>
                                                <div className="progress" style={{ height: 25 }}>
                                                    <div
                                                        className="progress-bar catalogue-progress"
                                                        role="progressbar"
                                                        style={{ width: "85%" }}
                                                        aria-valuenow={50}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    />
                                                </div>
                                            </div>
                                            <div className="cataBox">
                                                <div className="catalogue-contentBox">
                                                    <div className="cata-chart-content">
                                                        <li>Abbey Road</li>
                                                        <p>CAT0084 - Demo Release 84</p>
                                                    </div>
                                                    <p>Album 10</p>
                                                </div>
                                                <div className="progress" style={{ height: 25 }}>
                                                    <div
                                                        className="progress-bar catalogue-progress"
                                                        role="progressbar"
                                                        style={{ width: "75%" }}
                                                        aria-valuenow={50}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    />
                                                </div>
                                            </div>
                                            <div className="cataBox">
                                                <div className="catalogue-contentBox">
                                                    <div className="cata-chart-content">
                                                        <li>Songs in the Key of Life</li>
                                                        <p>CAT0084 - Demo Release 84</p>
                                                    </div>
                                                    <p>Album 10</p>
                                                </div>
                                                <div className="progress" style={{ height: 25 }}>
                                                    <div
                                                        className="progress-bar catalogue-progress"
                                                        role="progressbar"
                                                        style={{ width: "65%" }}
                                                        aria-valuenow={50}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    />
                                                </div>
                                            </div>
                                            <div className="cataBox">
                                                <div className="catalogue-contentBox">
                                                    <div className="cata-chart-content">
                                                        <li>Purple Rain</li>
                                                        <p>CAT0084 - Demo Release 84</p>
                                                    </div>
                                                    <p>Album 10</p>
                                                </div>
                                                <div className="progress" style={{ height: 25 }}>
                                                    <div
                                                        className="progress-bar catalogue-progress"
                                                        role="progressbar"
                                                        style={{ width: "60%" }}
                                                        aria-valuenow={50}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    />
                                                </div>
                                            </div>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-xxl-4 Stream-col">
                                <div className="chart-content charts mt-4 ">
                                    <div className="inner-content d-flex justify-content-between align-items-center">
                                        <h6>Total Songs</h6>
                                        <div className="selectBox">
                                            <select id="Territories-days">
                                                <option value="Sort By">Sort By</option>
                                                <option value="Sort By">7 days</option>
                                            </select>
                                            <select id="Top-Territories">
                                                <option value="All">Select Labels</option>
                                                <option value="All">All</option>
                                            </select>
                                            <i className="fa fa-ellipsis-h" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="catal-charts">
                                        <canvas id="progressChart" />
                                    </div>
                                    <div className="catalogue-charts-main">
                                        <ol type={1} className="catalogue-chartbox">
                                            <div className="cata-border">
                                                <div className="catalogue-contentBox">
                                                    <div className="cata-chart-content">
                                                        <li>CAT0084 - Demo Release 84</li>
                                                        <p className="cata-pra">Sabrina Carpenter</p>
                                                    </div>
                                                    <p>Album 10</p>
                                                </div>
                                            </div>
                                            <div className="cata-border">
                                                <div className="catalogue-contentBox">
                                                    <div className="cata-chart-content">
                                                        <li>CAT0084 - Demo Release 84</li>
                                                        <p className="cata-pra">Drake</p>
                                                    </div>
                                                    <p>Album 10</p>
                                                </div>
                                            </div>
                                            <div className="cata-border">
                                                <div className="catalogue-contentBox">
                                                    <div className="cata-chart-content">
                                                        <li>CAT0084 - Demo Release 84</li>
                                                        <p className="cata-pra">The Weeknd</p>
                                                    </div>
                                                    <p>Album 10</p>
                                                </div>
                                            </div>
                                            <div className="cata-border">
                                                <div className="catalogue-contentBox">
                                                    <div className="cata-chart-content">
                                                        <li>CAT0084 - Demo Release 84</li>
                                                        <p className="cata-pra">Taylor Swift</p>
                                                    </div>
                                                    <p>Album 10</p>
                                                </div>
                                            </div>
                                            <div className="cata-border">
                                                <div className="catalogue-contentBox">
                                                    <div className="cata-chart-content">
                                                        <li>CAT0084 - Demo Release 84</li>
                                                        <p className="cata-pra">Bruno Mars</p>
                                                    </div>
                                                    <p>Album 10</p>
                                                </div>
                                            </div>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-xxl-4 Stream-col">
                                <div className="chart-content charts mt-4 ">
                                    <div className="inner-content d-flex justify-content-between align-items-center">
                                        <h6>Total Songs</h6>
                                        <div className="selectBox">
                                            <select id="Territories-days">
                                                <option value="Sort By">Sort By</option>
                                                <option value="Sort By">7 days</option>
                                            </select>
                                            <select id="Top-Territories">
                                                <option value="All">Select Labels</option>
                                                <option value="All">All</option>
                                            </select>
                                            <i className="fa fa-ellipsis-h" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="catal-charts catal-pei-chart">
                                        <canvas className="catalogue-pieChart" id="pieChart" />
                                    </div>
                                    <div className="catalogue-charts-main">
                                        <ol type={1} className="catalogue-chartbox">
                                            <li>English</li>
                                            <li>Spanish</li>
                                            <li>Hindi</li>
                                            <li>Korean</li>
                                            <li>Japanese</li>
                                        </ol>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-xxl-4 Stream-col">
                                <div className="chart-content charts mt-4 ">
                                    <div className="inner-content d-flex justify-content-between align-items-center">
                                        <h6>Total Songs</h6>
                                        <div className="selectBox">
                                            <select id="Territories-days">
                                                <option value="Sort By">Sort By</option>
                                                <option value="Sort By">7 days</option>
                                            </select>
                                            <select id="Top-Territories">
                                                <option value="All">Select Labels</option>
                                                <option value="All">All</option>
                                            </select>
                                            <i className="fa fa-ellipsis-h" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="catal-charts catalog-barchart">
                                        <canvas id="stackedBarChart" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-xxl-4 Stream-col">
                                <div className="chart-content charts mt-4 ">
                                    <div className="inner-content d-flex justify-content-between align-items-center">
                                        <h6>Total Songs</h6>
                                        <div className="selectBox">
                                            <select id="Territories-days">
                                                <option value="Sort By">Sort By</option>
                                                <option value="Sort By">7 days</option>
                                            </select>
                                            <select id="Top-Territories">
                                                <option value="All">Select Labels</option>
                                                <option value="All">All</option>
                                            </select>
                                            <i className="fa fa-ellipsis-h" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="catal-charts catalog-dounut-chart">
                                        <canvas id="myChart" />
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-12 col-md-6 col-xxl-4 Stream-col">
                                <div className="chart-content charts mt-4 ">
                                    <div className="inner-content d-flex justify-content-between align-items-center">
                                        <h6>Total Album</h6>
                                        <div className="selectBox">
                                            <select id="Territories-days">
                                                <option value="Sort By">Sort By</option>
                                                <option value="Sort By">7 days</option>
                                            </select>
                                            <select id="Top-Territories">
                                                <option value="All">Select Labels</option>
                                                <option value="All">All</option>
                                            </select>
                                            <i className="fa fa-ellipsis-h" aria-hidden="true" />
                                        </div>
                                    </div>
                                    <div className="catalogue-charts-main">
                                        <ol type={1} className="catalogue-chartbox">
                                            <div className="cataBox">
                                                <div className="catalogue-contentBox">
                                                    <div className="cata-chart-content">
                                                        <li>Kendrick Lamar</li>
                                                        <p>CAT0084 - Demo Release 84</p>
                                                    </div>
                                                </div>
                                                <div className="progress" style={{ height: 25 }}>
                                                    <div
                                                        className="progress-bar catalogue-progress"
                                                        role="progressbar"
                                                        style={{ width: "100%" }}
                                                        aria-valuenow={50}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    />
                                                </div>
                                            </div>
                                            <div className="cataBox">
                                                <div className="catalogue-contentBox">
                                                    <div className="cata-chart-content">
                                                        <li>Sabrina Carpenter</li>
                                                        <p>CAT0084 - Demo Release 84</p>
                                                    </div>
                                                </div>
                                                <div className="progress" style={{ height: 25 }}>
                                                    <div
                                                        className="progress-bar catalogue-progress"
                                                        role="progressbar"
                                                        style={{ width: "85%" }}
                                                        aria-valuenow={50}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    />
                                                </div>
                                            </div>
                                            <div className="cataBox">
                                                <div className="catalogue-contentBox">
                                                    <div className="cata-chart-content">
                                                        <li>Drake</li>
                                                        <p>CAT0084 - Demo Release 84</p>
                                                    </div>
                                                </div>
                                                <div className="progress" style={{ height: 25 }}>
                                                    <div
                                                        className="progress-bar catalogue-progress"
                                                        role="progressbar"
                                                        style={{ width: "75%" }}
                                                        aria-valuenow={50}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    />
                                                </div>
                                            </div>
                                            <div className="cataBox">
                                                <div className="catalogue-contentBox">
                                                    <div className="cata-chart-content">
                                                        <li>Morgan Wallen</li>
                                                        <p>CAT0084 - Demo Release 84</p>
                                                    </div>
                                                </div>
                                                <div className="progress" style={{ height: 25 }}>
                                                    <div
                                                        className="progress-bar catalogue-progress"
                                                        role="progressbar"
                                                        style={{ width: "65%" }}
                                                        aria-valuenow={50}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    />
                                                </div>
                                            </div>
                                            <div className="cataBox">
                                                <div className="catalogue-contentBox">
                                                    <div className="cata-chart-content">
                                                        <li>PARTYNEXTDOOR</li>
                                                        <p>CAT0084 - Demo Release 84</p>
                                                    </div>
                                                </div>
                                                <div className="progress" style={{ height: 25 }}>
                                                    <div
                                                        className="progress-bar catalogue-progress"
                                                        role="progressbar"
                                                        style={{ width: "65%" }}
                                                        aria-valuenow={50}
                                                        aria-valuemin={0}
                                                        aria-valuemax={100}
                                                    />
                                                </div>
                                            </div>
                                        </ol>
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

export default CatalogueComponent