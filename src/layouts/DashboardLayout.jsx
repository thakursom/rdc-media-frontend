import Navbar from "../components/Navbar/Navbar";
import { Outlet, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

function DashboardLayout() {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    useEffect(() => {
        const sidebar = document.getElementById("sidebarRight");

        if (!sidebar) return;

        if (sidebarOpen) {
            sidebar.classList.add("rightbarWidth");
        } else {
            sidebar.classList.remove("rightbarWidth");
        }
    }, [sidebarOpen]);



    return (
        <>
            <header className={`header ${sidebarOpen ? "headerWidth" : ""}`}>
                <div className="hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>
                    <span className="bar" />
                    <span className="bar" />
                    <span className="bar" />
                    <span className="bar" />
                </div>
                <div className="header-logo">
                    <div className="img">
                        <a href="#">
                            <img src="../assets/Img//RDC-MEDIA-Logo.png" alt="not found" />
                        </a>
                    </div>
                </div>
                <div className="user d-flex justyfy-content-between align-items-center gap-3 ms-auto">
                    <div className="icon">
                        <i className="fa fa-envelope" aria-hidden="true">
                            <span className="badge text-white bg-danger">10</span>
                        </i>
                    </div>
                    <div className="user-img ms-1 dropdown-toggle" data-bs-toggle="dropdown">
                        <img src="../assets/Img/profile.jpg" alt="Not found" />
                        <ul className="dropdown-menu">
                            <li>
                                <button className="dropdown-item" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                        <div className="mobile-dropdown">
                            <ul className="menu">
                                <li>
                                    <a href="#">Action</a>
                                </li>
                                <li>
                                    <a href="#">Another Action</a>
                                </li>
                                <li>
                                    <a href="#">Some Else here</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="dropdown">
                        <a
                            className="btn dropdown-toggle"
                            href="#"
                            role="button"
                            id="dropdownMenuLink"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            David deo
                        </a>
                        <ul className="dropdown-menu" aria-labelledby="dropdownMenuLink">
                            <li>
                                <a className="dropdown-item" href="#">
                                    Action
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Another action
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Something else here
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>


            {/* ✅ PASS PROPS HERE */}
            <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

            <Outlet />
        </>
    );
}

export default DashboardLayout;
