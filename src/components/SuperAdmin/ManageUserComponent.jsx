import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../services/api";
import { toast } from "react-toastify";
import CustomPagination from "../Pagination/CustomPagination";
import Loader from "../Loader/Loader";

function ManageUserComponent() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        totalDocs: 0,
        totalPages: 0,
        currentPage: 1,
        limit: 10
    });

    const [modalType, setModalType] = useState(null); // 'delete'
    const [selectedUser, setSelectedUser] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const navigate = useNavigate();

    const fetchUsers = async (page = 1, limit = 10, search = "") => {
        setLoading(true);
        try {
            const response = await apiRequest(`/users?page=${page}&limit=${limit}&search=${search}`, "GET", null, true);
            if (response.success) {
                setUsers(response.data.data || []);
                setPagination(response.data.pagination);
            } else {
                toast.error(response.data?.message || "Failed to fetch users");
            }
        } catch (error) {
            console.error("Error fetching users:", error);
            toast.error("An error occurred while fetching users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchUsers(1, pagination.limit, searchTerm);
    };

    const handleClearSearch = () => {
        setSearchTerm("");
        fetchUsers(1, pagination.limit, "");
    };

    const handlePageChange = (page) => {
        fetchUsers(page, pagination.limit, searchTerm);
    };

    const handleLimitChange = (newLimit) => {
        fetchUsers(1, newLimit, searchTerm);
    };

    const handleOpenModal = (type, user = null) => {
        setModalType(type);
        setSelectedUser(user);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setSelectedUser(null);
    };

    const handleDelete = async () => {
        if (!selectedUser) return;
        setIsDeleting(true);
        try {
            const response = await apiRequest(`/delete-user/${selectedUser.id || selectedUser._id}`, "DELETE", null, true);
            if (response.success) {
                toast.success("User deleted successfully");
                handleCloseModal();
                fetchUsers(pagination.currentPage, pagination.limit, searchTerm);
            } else {
                toast.error(response.message || response.data?.message || "Failed to delete user");
            }
        } catch (error) {
            console.error("Error deleting user:", error);
            toast.error("An error occurred while deleting user");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleExport = () => {
        // Placeholder for export functionality
        toast.info("Export functionality coming soon");
    };

    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="Audio-main-sec">
                    <div className="view-release">
                        <div className="view-release-heading">
                            <h6>Manage User</h6>
                        </div>
                        <div className="manage-genre-btn d-flex gap-2 align-items-center">
                            <form className="search-form d-flex gap-2" onSubmit={handleSearch}>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by name or email"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{ width: "250px", height: "38px" }}
                                />
                                <button type="submit" className="btn btn-info text-white" style={{ height: "38px" }}>Search</button>
                                {searchTerm && (
                                    <button type="button" className="btn btn-secondary" onClick={handleClearSearch} style={{ height: "38px" }}>Clear</button>
                                )}
                            </form>
                            <button className="btn btn-success" onClick={handleExport} style={{ height: "38px" }}>Export</button>
                            <button
                                className="btn mangageGenre"
                                onClick={() => navigate("/add-user")}
                                style={{ height: "38px" }}
                            >
                                <i className="fa-solid fa-plus" />
                                Add New
                            </button>
                        </div>
                    </div>

                    <div className="viewReleases-main-sec audio-sec">
                        {loading ? (
                            <Loader message="Fetching users..." variant="success" />
                        ) : (
                            <div className="table-responsive">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th>SN</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Roles</th>
                                            <th>Third Party Username</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.length > 0 ? (
                                            users.map((user, index) => (
                                                <tr key={user.id || user._id}>
                                                    <td>{(pagination.currentPage - 1) * pagination.limit + index + 1}</td>
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.role}</td>
                                                    <td>{user.third_party_username || "-"}</td>
                                                    <td className="excel-button view-subLabels-btn manageGenre" id="subLabelsBtn">
                                                        <div className="manage-gen-btnBox">
                                                            <button
                                                                className="btn excel"
                                                                id="subLabelsBtn"
                                                                onClick={() => navigate(`/add-user?id=${user.id}`)}
                                                            >
                                                                Edit
                                                            </button>
                                                            <button
                                                                className="btn excel"
                                                                id="subLabelsDel"
                                                                onClick={() => handleOpenModal('delete', user)}
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">No users found</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {!loading && pagination.totalPages > 0 && (
                        <CustomPagination
                            pageCount={pagination.totalPages}
                            onPageChange={handlePageChange}
                            currentPage={pagination.currentPage}
                            perPage={pagination.limit}
                            onPerPageChange={handleLimitChange}
                        />
                    )}
                </div>
            </section>

            {/* Delete Confirmation Modal */}
            {modalType === 'delete' && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Confirm Deletion</h5>
                                <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                            </div>
                            <div className="modal-body">
                                <p>Are you sure you want to delete the user <strong>{selectedUser?.name}</strong>? This action cannot be undone.</p>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancel</button>
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? 'Deleting...' : 'Delete User'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default ManageUserComponent;
