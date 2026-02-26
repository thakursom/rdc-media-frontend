import { NavLink } from "react-router-dom";
import { useState } from "react";

function Navbar({ sidebarOpen, setSidebarOpen }) {
    const [activeMenu, setActiveMenu] = useState(null);

    const toggleMenu = (menu) => {
        setActiveMenu(activeMenu === menu ? null : menu);
    };

    const handleMobileClose = () => {
        if (window.innerWidth <= 576) {
            setSidebarOpen(false);
        }
    };

    return (
        <>
            <section className={`left-sidebar ${sidebarOpen ? "active" : ""}`}>
                <div className="logo">
                    <div className="img">
                        <img src="../assets/Img/RDC-MEDIA-Logo.png" alt="not found" />
                    </div>

                    <div className="topButton text-end pt-2" onClick={handleMobileClose}>
                        <button type="button" className="btn-close closeButton" />
                    </div>
                </div>

                <ul className="sidemenu">

                    {/* Dashboard */}
                    <li className="menuItem">
                        <div className="inner-content">
                            <div className="menu-icon">
                                <img src="../assets/Img/sidemenu/speed-ometer 1.png" alt="" />
                            </div>
                            <NavLink to="/dashboard">Dashboard</NavLink>
                        </div>
                    </li>

                    {/* Distribution */}
                    <li className="menuItem liclass subMenu-toggle"
                        onClick={(e) => {
                            e.preventDefault();
                            toggleMenu("distribution");
                        }}
                    >
                        <div className="inner-content">
                            <div className="menu-icon">
                                <img src="../assets/Img/sidemenu/release 2.png" alt="" />
                            </div>

                            <a>
                                Distribution
                            </a>
                        </div>

                        <ul
                            className="subMenu subMenu1"
                            style={{
                                display:
                                    activeMenu === "distribution" ? "block" : "none",
                            }}
                        >
                            <li><NavLink to="/review">Review</NavLink></li>
                            <li><NavLink to="/catalogue">Catalogue Overview</NavLink></li>
                            <li><NavLink to="/add-releases">Add Releases</NavLink></li>
                            <li><NavLink to="/bulk-release">Add Bulk Releases</NavLink></li>
                            <li><NavLink to="/view-release">View All Releases</NavLink></li>
                            <li><NavLink to="/saved-release">Saved</NavLink></li>
                            <li><NavLink to="/rejected-release">Rejected</NavLink></li>
                        </ul>
                    </li>

                    {/* Labels */}
                    <li className="menuItem liclass subMenu-toggle"
                        onClick={(e) => {
                            e.preventDefault();
                            toggleMenu("labels");
                        }}
                    >
                        <div className="inner-content">
                            <div className="menu-icon">
                                <img src="../assets/Img/sidemenu/sub label.png" alt="" />
                            </div>

                            <a>
                                Labels
                            </a>
                        </div>

                        <ul
                            className="subMenu subMenu2"
                            style={{
                                display: activeMenu === "labels" ? "block" : "none",
                            }}
                        >
                            <li><NavLink to="/add-label">Add Labels</NavLink></li>
                            <li><NavLink to="/view-label">View Labels</NavLink></li>
                        </ul>
                    </li>

                    {/* Artist */}
                    <li className="menuItem liclass subMenu-toggle"
                        onClick={(e) => {
                            e.preventDefault();
                            toggleMenu("artist");
                        }}
                    >
                        <div className="inner-content">
                            <div className="menu-icon">
                                <img src="../assets/Img/sidemenu/artist.png" alt="" />
                            </div>

                            <a>
                                Artist
                            </a>
                        </div>

                        <ul
                            className="subMenu subMenu3"
                            style={{
                                display: activeMenu === "artist" ? "block" : "none",
                            }}
                        >
                            <li><NavLink to="/add-artist">Add Artist</NavLink></li>
                            <li><NavLink to="/view-artist">View Artist</NavLink></li>
                        </ul>
                    </li>

                    {/* Newsletter */}
                    <li className="menuItem liclass subMenu-toggle"
                        onClick={(e) => {
                            e.preventDefault();
                            toggleMenu("newsletter");
                        }}>
                        <div className="inner-content">
                            <div className="menu-icon">
                                <img src="../assets/Img/sidemenu/news letter.png" alt="" />
                            </div>

                            <a>
                                News Letter
                            </a>
                        </div>

                        <ul
                            className="subMenu subMenu4"
                            style={{
                                display: activeMenu === "newsletter" ? "block" : "none",
                            }}
                        >
                            <li><NavLink to="/add-newsletter">Add Newsletter</NavLink></li>
                            <li><NavLink to="/view-newsletter">View Newsletter</NavLink></li>
                        </ul>
                    </li>

                    {/* Support */}
                    <li className="menuItem liclass subMenu-toggle"
                        onClick={(e) => {
                            e.preventDefault();
                            toggleMenu("support");
                        }}>
                        <div className="inner-content">
                            <div className="menu-icon">
                                <img src="../assets/Img/sidemenu/support.png" alt="" />
                            </div>

                            <a>
                                Support
                            </a>
                        </div>

                        <ul
                            className="subMenu subMenu5"
                            style={{
                                display: activeMenu === "support" ? "block" : "none",
                            }}
                        >
                            <li><NavLink to="/view-ticket">View Ticket</NavLink></li>
                        </ul>
                    </li>

                    {/* Settings */}
                    <li className="menuItem liclass subMenu-toggle"
                        onClick={(e) => {
                            e.preventDefault();
                            toggleMenu("settings");
                        }}>
                        <div className="inner-content">
                            <div className="menu-icon">
                                <img src="../assets/Img/settings 1.png" alt="" />
                            </div>

                            <a>
                                Settings
                            </a>
                        </div>

                        <ul
                            className="subMenu subMenu6"
                            style={{
                                display: activeMenu === "settings" ? "block" : "none",
                            }}
                        >
                            <li><NavLink to="/genre">Manage Genre</NavLink></li>
                            <li><NavLink to="/sub-genre">Manage Sub Genre</NavLink></li>
                            {/* <li><NavLink to="/permissions">Manage Permissions</NavLink></li> */}
                            <li><NavLink to="/users">Manage Users</NavLink></li>
                            <li><NavLink to="/dsp">Manage DSP's</NavLink></li>
                            <li><NavLink to="/countries">Manage Countries</NavLink></li>
                            <li><NavLink to="/upc">Manage UPC</NavLink></li>
                        </ul>
                    </li>

                </ul>
            </section>
        </>
    );
}

export default Navbar;
