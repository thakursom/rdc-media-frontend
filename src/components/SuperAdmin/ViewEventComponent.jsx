import React, { useState, useEffect } from 'react';
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";

function ViewEventComponent() {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [appliedSearch, setAppliedSearch] = useState("");

    const [pagination, setPagination] = useState({
        totalDocs: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });

    const fetchAssignments = async (page = 1, currentLimit = pagination.limit, search = appliedSearch) => {
        setLoading(true);
        try {
            let endpoint = `/track-event-assignments?page=${page}&limit=${currentLimit}`;
            if (search) endpoint += `&search=${encodeURIComponent(search)}`;

            const response = await apiRequest(endpoint, "GET", null, true);
            if (response.success) {
                setAssignments(response?.data?.data || []);
                if (response?.data?.pagination) {
                    setPagination(response.data.pagination);
                }
            } else {
                toast.error(response?.message || "Failed to fetch assignments");
            }
        } catch (error) {
            console.error("Fetch assignments error:", error);
            toast.error("An error occurred while fetching track event assignments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments(pagination.currentPage, pagination.limit, appliedSearch);
    }, [pagination.currentPage, appliedSearch]);

    const handleSearch = () => {
        setAppliedSearch(searchQuery);
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handleReset = () => {
        setSearchQuery("");
        setAppliedSearch("");
        setPagination(prev => ({ ...prev, currentPage: 1 }));
    };

    const handlePageChange = (page) => {
        setPagination(prev => ({ ...prev, currentPage: page }));
    };

    const handleExportExcel = async () => {
        try {
            toast.info("Exporting Track Event Assignments...");
            
            let endpoint = `/export-track-event-assignments`;
            if (appliedSearch) endpoint += `?search=${encodeURIComponent(appliedSearch)}`;

            const blob = await apiRequest(endpoint, "GET", null, true, true);
            
            // Create a link element, hide it, direct it to the blob, and click it
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `track-event-assignments-${new Date().toISOString().split('T')[0]}.xlsx`);
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success("Excel exported successfully");
        } catch (error) {
            console.error("Export error:", error);
            toast.error(error.message || "Failed to export excel");
        }
    };

    return (
        <section className="right-sidebar" id="sidebarRight">
            <div className="Audio-main-sec">
                <div className="view-release" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
                    <div className="view-release-heading my-0">
                        <h6 className='clPurple'>Track Event Assignments</h6>
                    </div>

                    <div className="d-flex align-items-center flex-wrap gap-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search Track / Release / Event"
                            style={{ width: '300px' }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />

                        <button type="button" className="mainBtn bgPurple clWhite" onClick={handleSearch}>
                            Search
                        </button>
                        <button type="button" className="mainBtn bgGray clWhite" onClick={handleReset}>
                            Reset
                        </button>
                        <button type="button" className="mainBtn bgPurple clWhite" onClick={handleExportExcel}>
                            <i className="fa-regular fa-file-excel me-1"></i> Export Excel
                        </button>
                    </div>
                </div>

                <div className="viewReleases-main-sec audio-sec mt-3">
                    {loading ? (
                        <Loader message="Fetching Assignments..." variant="success" />
                    ) : (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>SN</th>
                                    <th>Track Title</th>
                                    <th>Release Title</th>
                                    <th>Assigned Events</th>
                                    <th>Assigned Date</th>
                                    <th>Event Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {assignments.length > 0 ? (
                                    assignments.map((item, index) => (
                                        <tr key={item._id}>
                                            <td>{((pagination.currentPage - 1) * pagination.limit) + index + 1}</td>
                                            <td>{item.trackTitle}</td>
                                            <td>{item.releaseTitle}</td>
                                            <td>{item.eventTitle}</td>
                                            <td>{new Date(item.assignedDate).toLocaleDateString()}</td>
                                            <td>{new Date(item.eventDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="text-center py-5">
                                            <div className="mb-2">
                                                <i className="fa-solid fa-link-slash fa-3x text-muted"></i>
                                            </div>
                                            No assignments found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    )}
                </div>

                {!loading && pagination.totalPages > 1 && (
                    <CustomPagination
                        pageCount={pagination.totalPages}
                        onPageChange={handlePageChange}
                        currentPage={pagination.currentPage}
                        perPage={pagination.limit}
                    />
                )}
            </div>
        </section>
    );
}

export default ViewEventComponent;
