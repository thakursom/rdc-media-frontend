import React, { useState, useEffect } from 'react';
import { apiRequest } from "../../services/api";
import { toast } from 'react-toastify';
import Loader from '../Loader/Loader';
import DashboardLineChart from './DashboardLineChart';

function DashboardComponent() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        summary: { totalAlbums: 0, todayAlbums: 0, totalTracks: 0, totalLabels: 0 },
        trendData: { labels: [], albums: [], tracks: [], labelsTrend: [] },
        topArtists: [],
        topGenres: [],
        topLabels: [],
        topLanguages: []
    });

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const fetchStats = async (start = '', end = '') => {
        setLoading(true);
        try {
            let endpoint = '/dashboard-stats';
            if (start && end) {
                endpoint += `?startDate=${start}&endDate=${end}`;
            }

            const response = await apiRequest(endpoint, 'GET', null, true);
            if (response.success) {
                // The backend returns { success: true, data: { summary: ... } }
                // and apiRequest wraps it in { success: ..., data: backendResponse }
                setStats(response?.data?.data || response?.data);
            } else {
                toast.error(response.message || "Failed to load dashboard stats");
            }
        } catch (error) {
            console.error("Dashboard error:", error);
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleSearch = () => {
        if ((startDate && !endDate) || (!startDate && endDate)) {
            toast.warning("Please select both start and end dates");
            return;
        }
        fetchStats(startDate, endDate);
    };

    const handleClear = () => {
        setStartDate('');
        setEndDate('');
        fetchStats();
    };



    const renderProgressBar = (item, index, maxCount) => {
        const bgColors = ['#b194f4', '#D3A336', '#3b82f6', '#10b981', '#8b5cf6'];
        const color = bgColors[index % bgColors.length];
        const percentage = maxCount > 0 ? (item.count / maxCount) * 100 : 0;

        return (
            <div key={index} className="d-flex align-items-center mb-4">
                <div style={{ width: '150px', fontSize: '13px', fontWeight: '500' }}>{item.name}</div>
                <div className="d-flex align-items-center justify-content-center bg-light rounded-circle border shadow-sm mx-3" style={{ width: '35px', height: '35px' }}>
                    <i className="fa-solid fa-user text-muted"></i>
                </div>
                <div className="flex-grow-1 position-relative">
                    <div className="progress" style={{ height: '30px', borderRadius: '15px', backgroundColor: '#f1f5f9' }}>
                        <div className="progress-bar" role="progressbar" style={{ width: `${percentage}%`, backgroundColor: color, borderRadius: '15px' }}></div>
                    </div>
                    <div className="position-absolute shadow-sm d-flex align-items-center justify-content-center bg-white rounded-circle"
                        style={{
                            width: '36px', height: '36px',
                            right: '-5px', top: '-3px',
                            fontWeight: 'bold', color: color,
                            border: `2px solid #fff`
                        }}>
                        {item.count}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="right-sidebar" id="sidebarRight">
            <div className="container-fluid p-0 pt-4">
                {/* Filters */}
                <div className="d-flex flex-wrap align-items-end gap-3 mb-4">
                    <div>
                        <label className="form-label text-muted small mb-1">Start Date</label>
                        <input type="date" className="form-control bg-white shadow-sm border-0" value={startDate} onChange={e => setStartDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="form-label text-muted small mb-1">End Date</label>
                        <input type="date" className="form-control bg-white shadow-sm border-0" value={endDate} onChange={e => setEndDate(e.target.value)} />
                    </div>
                    <div className="d-flex gap-2">
                        <button className="btn text-white shadow-sm bgPurple" onClick={handleSearch}>
                            <i className="fa-solid fa-search me-1"></i> Search
                        </button>
                        <button className="btn btn-secondary text-white shadow-sm" style={{ backgroundColor: '#64748b', border: 'none' }} onClick={handleClear}>
                            <i className="fa-solid fa-xmark me-1"></i> Clear
                        </button>
                    </div>
                </div>

                {loading ? <Loader variant="success" message='Loading Dashboard...' /> : (
                    <>
                        {/* Metric Cards */}
                        <div className="row g-3 mb-4">
                            <div className="col-12 col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm rounded-3 h-100">
                                    <div className="card-body p-4 d-flex align-items-center">
                                        <div className="d-flex flex-column flex-grow-1">
                                            <span className="text-muted small fw-semibold mb-2">Total Albums</span>
                                            <div className="d-flex align-items-center mt-2">
                                                <div className="rounded-2 d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: '45px', height: '45px', backgroundColor: '#f3e8ff', color: '#b194f4', fontSize: '20px' }}>
                                                    <i className="fa-solid fa-compact-disc"></i>
                                                </div>
                                                <h4 className="mb-0 fw-bold">{stats?.summary?.totalAlbums || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="col-12 col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm rounded-3 h-100">
                                    <div className="card-body p-4 d-flex align-items-center">
                                        <div className="d-flex flex-column flex-grow-1">
                                            <span className="text-muted small fw-semibold mb-2">Today Albums</span>
                                            <div className="d-flex align-items-center mt-2">
                                                <div className="rounded-2 d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: '45px', height: '45px', backgroundColor: '#f3e8ff', color: '#b194f4', fontSize: '20px' }}>
                                                    <i className="fa-solid fa-record-vinyl"></i>
                                                </div>
                                                <h4 className="mb-0 fw-bold">{stats?.summary?.todayAlbums || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm rounded-3 h-100">
                                    <div className="card-body p-4 d-flex align-items-center">
                                        <div className="d-flex flex-column flex-grow-1">
                                            <span className="text-muted small fw-semibold mb-2">Total Tracks</span>
                                            <div className="d-flex align-items-center mt-2">
                                                <div className="rounded-2 d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: '45px', height: '45px', backgroundColor: '#f3e8ff', color: '#b194f4', fontSize: '20px' }}>
                                                    <i className="fa-solid fa-align-left" style={{ transform: 'rotate(90deg)' }}></i>
                                                </div>
                                                <h4 className="mb-0 fw-bold">{stats?.summary?.totalTracks || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-12 col-md-6 col-xl-3">
                                <div className="card border-0 shadow-sm rounded-3 h-100">
                                    <div className="card-body p-4 d-flex align-items-center">
                                        <div className="d-flex flex-column flex-grow-1">
                                            <span className="text-muted small fw-semibold mb-2">Total Labels</span>
                                            <div className="d-flex align-items-center mt-2">
                                                <div className="rounded-2 d-flex align-items-center justify-content-center me-3 shadow-sm" style={{ width: '45px', height: '45px', backgroundColor: '#f3e8ff', color: '#b194f4', fontSize: '20px' }}>
                                                    <i className="fa-solid fa-user-group"></i>
                                                </div>
                                                <h4 className="mb-0 fw-bold">{stats?.summary?.totalLabels || 0}</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Main Chart */}
                        <div className="card border-0 shadow-sm rounded-3 mb-4">
                            <div className="card-body p-4">
                                <DashboardLineChart trendData={stats?.trendData} key={JSON.stringify(stats?.trendData)} />
                            </div>
                        </div>

                        {/* Lower Grid */}
                        <div className="row g-4">
                            {/* Top Artist */}
                            <div className="col-12 col-xl-6">
                                <div className="card border-0 shadow-sm rounded-3 h-100">
                                    <div className="card-body p-4">
                                        <h6 className="fw-semibold text-muted mb-4 small">Top Artist</h6>
                                        {stats?.topArtists?.length > 0 ? (
                                            (() => {
                                                const maxArtistCount = Math.max(...stats.topArtists.map(a => a.count || 0));
                                                return stats.topArtists.slice(0, 5).map((artist, index) => renderProgressBar(artist, index, maxArtistCount));
                                            })()
                                        ) : (
                                            <div className="text-muted small">No data available</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Top Genre */}
                            <div className="col-12 col-xl-6">
                                <div className="card border-0 shadow-sm rounded-3 h-100">
                                    <div className="card-body p-4">
                                        <h6 className="fw-semibold text-muted mb-4 small">Top Genre</h6>
                                        {stats?.topGenres?.length > 0 ? (
                                            <div className="d-flex flex-column align-items-center justify-content-center h-100" style={{ paddingBottom: '30px', minHeight: '250px' }}>
                                                <div className="position-relative d-flex justify-content-center mt-4" style={{ width: '150px', height: '180px' }}>
                                                    <div style={{
                                                        width: '0',
                                                        height: '0',
                                                        borderLeft: '80px solid transparent',
                                                        borderRight: '80px solid transparent',
                                                        borderBottom: '180px solid rgba(177, 148, 244, 0.8)', // Matching clPurple but translucent
                                                        position: 'absolute',
                                                        bottom: 0
                                                    }}></div>
                                                    <div className="bgPurple text-white rounded position-absolute py-1 px-2 shadow" style={{ top: '-15px', fontSize: '12px', fontWeight: 'bold', zIndex: 2 }}>
                                                        {stats.topGenres[0].count}
                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: '-4px', left: '50%', transform: 'translateX(-50%)',
                                                            width: '0', height: '0',
                                                            borderLeft: '4px solid transparent',
                                                            borderRight: '4px solid transparent',
                                                            borderTop: '4px solid #b194f4'
                                                        }}></div>
                                                    </div>
                                                </div>
                                                <div className="clPurple mt-3 fw-semibold small">
                                                    {stats.topGenres[0].name}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-muted small">No data available</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Top Labels */}
                            <div className="col-12 col-xl-6">
                                <div className="card border-0 shadow-sm rounded-3 h-100 min-vh-25">
                                    <div className="card-body p-4">
                                        <h6 className="fw-semibold text-muted mb-4 small">Top Labels</h6>
                                        {stats?.topLabels?.length > 0 ? (
                                            stats.topLabels.map((item, index) => (
                                                <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                                                    <span className="small text-dark fw-medium">{item.name}</span>
                                                    <span className="badge bg-light text-dark shadow-sm rounded-pill px-3 py-2">{item.count}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-muted small">No data available</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Top Language */}
                            <div className="col-12 col-xl-6">
                                <div className="card border-0 shadow-sm rounded-3 h-100 min-vh-25">
                                    <div className="card-body p-4">
                                        <h6 className="fw-semibold text-muted mb-4 small">Top Language</h6>
                                        {stats?.topLanguages?.length > 0 ? (
                                            stats.topLanguages.map((item, index) => (
                                                <div key={index} className="d-flex justify-content-between align-items-center mb-3">
                                                    <span className="small text-dark fw-medium">{item.name}</span>
                                                    <span className="badge bg-light text-dark shadow-sm rounded-pill px-3 py-2">{item.count}</span>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-muted small">Loading chart...</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}

export default DashboardComponent;
