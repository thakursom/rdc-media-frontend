import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './HomeComponent.css'

function HomeComponent() {
    const navigate = useNavigate();
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        if (theme === "dark") {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
        localStorage.setItem("theme", theme);

        // Cleanup: remove dark-mode className when leaving the Home page
        return () => {
            document.body.classList.remove("dark-mode");
        };
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === "light" ? "dark" : "light");
    };
    return (
        <>
            <header className="custom-header">
                <nav className="navbar navbar-expand-xl bg-body-tertiary shadow-sm">
                    <div className="container-fluid">
                        <div className="home-logo">
                            <a className="navbar-brand fw-bold" href="#">MusicBrand</a>
                        </div>

                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
                            <span className="navbar-toggler-icon"></span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarContent">
                            <ul className="navbar-nav mx-auto mb-2 mb-lg-0 header-menu">
                                <li className="nav-item">
                                    <a className="nav-link active" href="#">Release Music</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Publishing</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Pro Services</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Plans</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Resources</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Royalty Splits</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="#">Growth Program</a>
                                </li>
                            </ul>
                            <div className="header-right">
                                <button className="gradient-btn" onClick={() => navigate('/login')}> Login </button>
                                {/* <button className="gradient-btn me-3"> Sign Up </button> */}
                                <div className="dropdown">
                                    <button type="button" className="btn dropdown-toggle lang-btn" data-bs-toggle="dropdown">
                                        <i className="fa-solid fa-earth-asia"></i>
                                    </button>
                                    <ul className="dropdown-menu header-custom-drop">
                                        <li><a className="dropdown-item" href="#">Hindi</a></li>
                                        <li><a className="dropdown-item" href="#">English</a></li>
                                        <li><a className="dropdown-item" href="#">Spanish</a></li>
                                        <li><a className="dropdown-item" href="#">French</a></li>
                                        <li><a className="dropdown-item" href="#">Spanish</a></li>
                                    </ul>
                                </div>
                                <button className="btn btn-outline-secondary" id="themeToggle" onClick={toggleTheme}>
                                    {theme === "dark" ? "☀️" : "🌙"}
                                </button>

                            </div>
                        </div>
                    </div>
                </nav>
            </header>
            <section className="hero-section">
                <div className="container">
                    <div className="hero-innerContent">
                        <div className="heading">
                            <h1>Digital <mark className="">Music Distribution</mark> Services</h1>
                        </div>
                        <div className="innerpara">
                            <p>Get your music on Spotify, Apple Music, TikTok, YouTube, Tidal, Tencent and more.
                                Keep 100% ownership of your music and stay in control of your career. Unlimited Releases
                                starting at
                                $22.99/year.
                            </p>
                        </div>
                        <button className="gradient-btn">DISTRIBUTE MY MUSIC ONLINE</button>
                    </div>
                    <div className="hero-bottom-content">
                        <p>GET YOUR MUSIC ON</p>
                        <ul className="hero-iconBox">
                            <li><a href="#"><img src="/assets/Img/Spotify_Logo_RGB_White.svg" alt="Spotify" /></a> </li>
                            <li><a href="#"><img src="/assets/Img/applemusic.svg" alt="applemusic" /></a> </li>
                            <li><a href="#"><img src="/assets/Img/Amazon_Music_Logo_Horizontal_RGB_White_MASTER.svg"
                                alt="Amazon" /></a> </li>
                            <li><a href="#"><img src="/assets/Img/tiktok.svg" alt="tiktok" /></a> </li>
                            <li><a href="#"><img src="/assets/Img/tidal-white.svg" alt="tidal" /></a> </li>
                            <li><a href="#"><img src="/assets/Img/Beatport_white.svg" alt="Beatport" /></a> </li>
                            <li><a href="#"><img src="/assets/Img/Deezer_logo_white.svg" alt="Deezer" /></a> </li>
                            <li><a href="#"><img src="/assets/Img/YouTube_Logo_white.svg" alt="YouTube" /></a> </li>
                            <li><a href="#"><img src="/assets/Img/vevo.svg" alt="vevo" /></a> </li>
                        </ul>
                    </div>
                </div>
            </section>
            <section className="about-brand">
                <div className="container">
                    <div className="sec-inner">
                        <div className="heading">
                            <h2>What is <mark>MusicBrand</mark> ?</h2>
                        </div>
                        <div className="subHead">
                            {/* <P>Your <mark>Independent</mark> Music Distribution Company</P> */}
                        </div>
                        <div className="sec-para">
                            <p>MusicBrand, a part of Believe, is the leading global platform empowering independent artists to
                                build sustainable careers. Through cutting-edge technology and artist-first services, TuneCore
                                offers independent music distribution, publishing administration, and promotional tools that
                                help musicians grow their audience and revenue.</p>
                            <p>As a pioneer in indie music distribution and independent digital music distribution, TuneCore is
                                dedicated to making music accessible while keeping artists in control.</p>
                        </div>
                        <button className="gradient-btn">SEE OUR DISTRIBUTION PLANS</button>
                    </div>
                </div>
            </section>
            <section className="why-Choose">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="why-innerContent">
                                <div className="services-heading">
                                    <h2>Global <mark>Music Distribution.</mark></h2>
                                </div>
                                <div className="why-para">
                                    <p>Drop unlimited singles, EPs and albums on more global music stores than anywhere else.
                                    </p>
                                </div>
                                <div className="why-para">
                                    <p>Release to the biggest music streaming, download and social platforms like
                                        <strong>Spotify, Apple Music, TikTok, Amazon, Deezer, Instagram, and Tidal </strong> and
                                        more.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="sec-image">
                                <img src="/assets/Img/disteribution.png" alt="distribution" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="keep-safe">
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <div className="sec-image">
                                <img src="/assets/Img/keep-safe.png" alt="distribution" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="why-innerContent">
                                <div className="services-heading">
                                    <h2>Keep <mark>100% </mark></h2>
                                </div>
                                <div className="why-para">
                                    <p>All the royalties you earn go straight into your pocket.</p>
                                </div>
                                <div className="why-para">
                                    <p>We believe artists should stay independent, keep complete control of their careers and
                                        not be tied down by unfair deals and shady industry contracts.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="our-services">
                <div className="container">
                    <div className="service-mainbox">
                        <div className="services-heading">
                            <h2>Our <mark>Services</mark> </h2>
                        </div>
                        <ul className="service-menu">
                            <li className="service-item stream-col">
                                <div className="service-cardBox stream-child">
                                    <div className="service-icon BGgradient">
                                        <i className="fa-solid fa-circle-minus"></i>
                                    </div>
                                    <div className="service-content">
                                        <div className="service-head">
                                            <h6>VerseOne Distro</h6>
                                        </div>
                                        <div className="service-para">
                                            <p>Deliver your music and music videos to iTunes, Spotify, YouTube, TikTok, and
                                                more. Free of charge</p>
                                        </div>
                                        <mark>
                                            <a href="#">Join VerseOne <i className="fa-solid fa-arrow-right"></i></a>
                                        </mark>
                                    </div>
                                </div>
                            </li>
                            <li className="service-item stream-col">
                                <div className="service-cardBox stream-child">
                                    <div className="service-icon BGgradient">
                                        <i className="fa-solid fa-tower-broadcast"></i>
                                    </div>
                                    <div className="service-content">
                                        <div className="service-head">
                                            <h6>VerseOne Max</h6>
                                        </div>
                                        <div className="service-para">
                                            <p>Distribute your music. Keep 100% Royalties, 100% Copyrights, No revenue splits!
                                                No hidden fees.</p>
                                        </div>
                                        <mark>
                                            <a href="#">Learn More<i className="fa-solid fa-arrow-right"></i></a>
                                        </mark>
                                    </div>
                                </div>
                            </li>
                            <li className="service-item stream-col">
                                <div className="service-cardBox stream-child">
                                    <div className="service-icon BGgradient">
                                        <i className="fa-solid fa-circle-minus"></i>
                                    </div>
                                    <div className="service-content">
                                        <div className="service-head">
                                            <h6>VerseOne Pro</h6>
                                        </div>
                                        <div className="service-para">
                                            <p>Personalize our platform to match your brand Logo, select colors and offer a
                                                branded platform to your clients. </p>
                                        </div>
                                        <mark>
                                            <a href="#">Choose Your Plan <i className="fa-solid fa-arrow-right"></i></a>
                                        </mark>
                                    </div>
                                </div>
                            </li>
                            <li className="service-item stream-col">
                                <div className="service-cardBox stream-child">
                                    <div className="service-icon BGgradient">
                                        <i className="fa-solid fa-bullhorn"></i>
                                    </div>
                                    <div className="service-content">
                                        <div className="service-head">
                                            <h6>Promotion</h6>
                                        </div>
                                        <div className="service-para">
                                            <p>Want to gain exposure or target specific markets? Check out our promotional
                                                services.</p>
                                        </div>
                                        <mark>
                                            <a href="#">Discover Services <i className="fa-solid fa-arrow-right"></i></a>
                                        </mark>
                                    </div>
                                </div>
                            </li>
                            <li className="service-item stream-col">
                                <div className="service-cardBox stream-child">
                                    <div className="service-icon BGgradient">
                                        <i className="fa-solid fa-circle-minus"></i>
                                    </div>
                                    <div className="service-content">
                                        <div className="service-head">
                                            <h6>GoAsia</h6>
                                        </div>
                                        <div className="service-para">
                                            <p>GoAsia provides a launchpad for record labels and artists interested in breaking
                                                into the music industry in Asia.</p>
                                        </div>
                                        <mark>
                                            <a href="#">Learn More <i className="fa-solid fa-arrow-right"></i></a>
                                        </mark>
                                    </div>
                                </div>
                            </li>
                            <li className="service-item stream-col">
                                <div className="service-cardBox stream-child">
                                    <div className="service-icon BGgradient">
                                        <i className="fa-solid fa-circle-minus"></i>
                                    </div>
                                    <div className="service-content">
                                        <div className="service-head">
                                            <h6>Royalty Advance</h6>
                                        </div>
                                        <div className="service-para">
                                            <p>Advances range from $1,000 to as much as $1 million per artist depending on
                                                contract duration.</p>
                                        </div>
                                        <mark>
                                            <a href="#">How To Apply <i className="fa-solid fa-arrow-right"></i></a>
                                        </mark>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <section className="technology-feature">
                <div className="container">
                    <div className="service-mainbox">
                        <div className="services-heading">
                            <h2>Technology <mark>Features</mark></h2>
                        </div>
                        <ul className="feature-menu">
                            <li className="service-item stream-col">
                                <div className="service-cardBox stream-child">
                                    <div className="service-icon BGgradient">
                                        <i className="fa-solid fa-cloud-arrow-up"></i>
                                    </div>
                                    <div className="service-content">
                                        <div className="service-head">
                                            <h6>Bulk Uploading</h6>
                                        </div>
                                        <mark>
                                            <a href="#">Learn More<i className="fa-solid fa-arrow-right"></i></a>
                                        </mark>
                                    </div>
                                </div>
                            </li>
                            <li className="service-item stream-col">
                                <div className="service-cardBox stream-child">
                                    <div className="service-icon BGgradient">
                                        <i className="fa-regular fa-lightbulb"></i>
                                    </div>
                                    <div className="service-content">
                                        <div className="service-head">
                                            <h6>AI Image Generation</h6>
                                        </div>
                                        <mark>
                                            <a href="#">Learn More<i className="fa-solid fa-arrow-right"></i></a>
                                        </mark>
                                    </div>
                                </div>
                            </li>
                            <li className="service-item stream-col">
                                <div className="service-cardBox stream-child">
                                    <div className="service-icon BGgradient">
                                        <i className="fa-solid fa-code"></i>
                                    </div>
                                    <div className="service-content">
                                        <div className="service-head">
                                            <h6>Bulk DDEX transfer</h6>
                                        </div>
                                        <mark>
                                            <a href="#">Learn More<i className="fa-solid fa-arrow-right"></i></a>
                                        </mark>
                                    </div>
                                </div>
                            </li>
                            <li className="service-item stream-col">
                                <div className="service-cardBox stream-child">
                                    <div className="service-icon BGgradient">
                                        <i className="fa-regular fa-circle-check"></i>
                                    </div>
                                    <div className="service-content">
                                        <div className="service-head">
                                            <h6>User verification</h6>
                                        </div>
                                        <mark>
                                            <a href="#">Learn More<i className="fa-solid fa-arrow-right"></i></a>
                                        </mark>
                                    </div>
                                </div>
                            </li>
                            <li className="service-item stream-col">
                                <div className="service-cardBox stream-child">
                                    <div className="service-icon BGgradient">
                                        <i className="fa-solid fa-video"></i>
                                    </div>
                                    <div className="service-content">
                                        <div className="service-head">
                                            <h6>Video processing</h6>
                                        </div>
                                        <mark>
                                            <a href="#">Learn More<i className="fa-solid fa-arrow-right"></i></a>
                                        </mark>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <section className="choose-plan">
                <div className="container">
                    <div className="choose-mainbox">
                        <div className="services-heading text-center">
                            <h2>Choose Your<mark>Plan.</mark></h2>
                        </div>
                        <div className="row g-4 mt-5">
                            <div className="col-md-6 col-lg-4">
                                <div className="business-card">
                                    <div className="imgBox">
                                        <img src="/assets/Img/distro.jpeg" alt="plan" />
                                    </div>
                                    <div className="business-content-box">
                                        <div className="business-content">
                                            <div className="business-heading">
                                                <h6>VerseOne Distro</h6>
                                            </div>
                                            <ul className="business-menu">
                                                <li className="business-item"><i className="fa-regular fa-circle-check clGreen"></i>User
                                                    Dashboard with VerseOne logo</li>
                                                <li className="business-item"><i
                                                    className="fa-regular fa-circle-check clGreen"></i>Users Login on VerseOne
                                                    Login page</li>
                                                <li className="business-item"><i className="fa-regular fa-circle-xmark clRed"></i>User
                                                    Permissions management</li>
                                                <li className="business-item"><i className="fa-regular fa-circle-xmark clRed"></i>Admin
                                                    permissions management</li>
                                                <li className="business-item"><i className="fa-regular fa-circle-xmark clRed"></i>User
                                                    moderation tools</li>
                                                <li className="business-item"><i className="fa-regular fa-circle-xmark clRed"></i>User
                                                    prepaid releases</li>
                                                <li className="business-item"><i className="fa-regular fa-circle-xmark clRed"></i>User
                                                    pay-per-release revenue model</li>
                                                <li className="business-item"><i className="fa-regular fa-circle-xmark clRed"></i>User
                                                    annual subscription revenue model</li>
                                                <li className="business-item"><i className="fa-regular fa-circle-xmark clRed"></i>Custom
                                                    DSP aggregation revenue license</li>
                                            </ul>
                                            <div className="text-center my-4 mb-2">
                                                <button className="gradient-btn">VerseOne Distro</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="plan-info-top BGgradient">
                                        <h5>Besic</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4">
                                <div className="business-card">
                                    <div className="imgBox">
                                        <img src="/assets/Img/distro.jpeg" alt="plan" />
                                    </div>
                                    <div className="business-content-box">
                                        <div className="business-content">
                                            <div className="business-heading">
                                                <h6>VerseOne Distro</h6>
                                            </div>
                                            <ul className="business-menu">
                                                <li className="business-item"><i className="fa-regular fa-circle-check clGreen"></i>User
                                                    Dashboard with VerseOne logo</li>
                                                <li className="business-item"><i
                                                    className="fa-regular fa-circle-check clGreen"></i>Users Login on VerseOne
                                                    Login page</li>
                                                <li className="business-item"><i className="fa-regular fa-circle-check clGreen"></i>User
                                                    Permissions management</li>
                                                <li className="business-item"><i
                                                    className="fa-regular fa-circle-check clGreen"></i>Admin permissions
                                                    management</li>
                                                <li className="business-item"><i className="fa-regular fa-circle-check clGreen"></i>User
                                                    moderation tools</li>
                                                <li className="business-item"><i className="fa-regular fa-circle-xmark clRed"></i>User
                                                    prepaid releases</li>
                                                <li className="business-item"><i className="fa-regular fa-circle-xmark clRed"></i>User
                                                    pay-per-release revenue model</li>
                                                <li className="business-item"><i className="fa-regular fa-circle-xmark clRed"></i>User
                                                    annual subscription revenue model</li>
                                                <li className="business-item"><i className="fa-regular fa-circle-xmark clRed"></i>Custom
                                                    DSP aggregation revenue license</li>
                                            </ul>
                                            <div className="text-center my-4 mb-2">
                                                <button className="gradient-btn">VerseOne Distro</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="plan-info-top BGgradient">
                                        <h5>Pro</h5>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4">
                                <div className="business-card">
                                    <div className="imgBox">
                                        <img src="/assets/Img/distro.jpeg" alt="plan" />
                                    </div>
                                    <div className="business-content-box">
                                        <div className="business-content">
                                            <div className="business-heading">
                                                <h6>VerseOne Distro</h6>
                                            </div>
                                            <ul className="business-menu">
                                                <li className="business-item"><i className="fa-regular fa-circle-check clGreen"></i>User
                                                    Dashboard with VerseOne logo</li>
                                                <li className="business-item"><i
                                                    className="fa-regular fa-circle-check clGreen"></i>Users Login on VerseOne
                                                    Login page</li>
                                                <li className="business-item"><i className="fa-regular fa-circle-check clGreen"></i>User
                                                    Permissions management</li>
                                                <li className="business-item"><i
                                                    className="fa-regular fa-circle-check clGreen"></i>Admin permissions
                                                    management</li>
                                                <li className="business-item"><i className="fa-regular fa-circle-check clGreen"></i>User
                                                    moderation tools</li>
                                                <li className="business-item"><i className="fa-regular fa-circle-check clGreen"></i>User
                                                    prepaid releases</li>
                                                <li className="business-item"><i className="fa-regular fa-circle-check clGreen"></i>User
                                                    pay-per-release revenue model</li>
                                                <li className="business-item"><i className="fa-regular fa-circle-check clGreen"></i>User
                                                    annual subscription revenue model</li>
                                                <li className="business-item"><i
                                                    className="fa-regular fa-circle-check clGreen"></i>Custom DSP aggregation
                                                    revenue license</li>
                                            </ul>
                                            <div className="text-center my-4 mb-2">
                                                <button className="gradient-btn">VerseOne Distro</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="plan-info-top BGgradient">
                                        <h5>Max</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <footer className="footer">
                <div className="container">
                    <div className="footerBox">
                        <div className="footer-mainbox">
                            <div className="row">
                                <div className="col-sm-6 col-md-3">
                                    <div className="footer-heading">
                                        <h6><mark>Get Started</mark></h6>
                                    </div>
                                    <ul className="footer-menu">
                                        <li className="footer-item"><a className="footer-link" href="#">Sign up</a></li>
                                        <li className="footer-item"><a className="footer-link" href="./SellYourMusic.html">Sell Your Music</a></li>
                                        <li className="footer-item"><a className="footer-link" href="#">Support</a></li>
                                        <li className="footer-item"><a className="footer-link" href="#">Pricing</a></li>
                                        <li className="footer-item"><a className="footer-link" href="#">Blog</a></li>
                                        <li className="footer-item"><a className="footer-link" href="#">App</a></li>
                                        <li className="footer-item"><a className="footer-link" href="#">Ditto Pro</a></li>
                                        <li className="footer-item"><a className="footer-link" href="#">Ditto Labels</a></li>
                                    </ul>
                                </div>
                                <div className="col-sm-6 col-md-3">
                                    <div className="footer-heading">
                                        <h6><mark>Extras</mark></h6>
                                    </div>
                                    <ul className="footer-menu">
                                        <li className="footer-item"><a className="footer-link" href="#">Music Publishing</a></li>
                                        <li className="footer-item"><a className="footer-link" href="#">Sync Licensing</a></li>
                                        <li className="footer-item"><a className="footer-link" href="#">Music Promotion</a></li>
                                        <li className="footer-item"><a className="footer-link" href="#">Audio Mastering</a></li>
                                        <li className="footer-item"><a className="footer-link" href="#">Free Pre-Save Links</a></li>
                                        <li className="footer-item"><a className="footer-link" href="#">Music Videos</a></li>
                                        <li className="footer-item"><a className="footer-link" href="#">YouTube Content ID</a></li>
                                        <li className="footer-item"><a className="footer-link" href="#">Merch Store</a></li>
                                    </ul>
                                </div>
                                <div className="col-sm-6 col-md-3">
                                    <div className="footer-heading">
                                        <h6><mark>Company</mark></h6>
                                    </div>
                                    <ul className="footer-menu">
                                        <li className="footer-item"><a className="footer-link" href="#">Ditto X Conference</a></li>
                                        <li className="footer-item"><a className="footer-link" href="#">Industry Access</a></li>
                                        <li className="footer-item"><a className="footer-link" href="#">Refer a Friend</a></li>
                                        <li className="footer-item"><a className="footer-link" href="#">Affiliates</a></li>
                                        <li className="footer-item"><a className="footer-link" href="#">Press</a></li>
                                        <li className="footer-item"><a className="footer-link" href="#">Updates</a></li>
                                    </ul>
                                </div>
                                <div className="col-sm-6 col-md-3">
                                    <div className="footer-heading">
                                        <h6> <mark>Join our newsletter</mark></h6>
                                    </div>
                                    <form className="footer-form">
                                        <div className="form-group footer-group">
                                            <input type="email" placeholder="Email" />
                                            <button className="footer-btn">Subscribe</button>
                                        </div>
                                    </form>
                                    <ul className="social-md-icon">
                                        <li><a href="#"><i className="fa-brands fa-instagram"></i></a></li>
                                        <li><a href="#"> <i className="fa-brands fa-x-twitter"></i></a></li>
                                        <li><a href="#"> <i className="fa-brands fa-tiktok"></i>  </a></li>
                                        <li><a href="#"> <i className="fa-brands fa-spotify"></i> </a></li>
                                        <li><a href="#"><i className="fa-brands fa-youtube"></i> </a> </li>
                                        <li><a href="#"> <i className="fa-brands fa-linkedin"></i> </a></li>
                                        <li><a href="#"> <i className="fa-brands fa-facebook"></i> </a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bootem">
                        <div className="fotter-inner">
                            <h6>MusicBrand</h6>
                            <p>&copy; Ditto Music 2025 Company No: 03976764. VAT Number: GB107076729</p>
                        </div>
                        <div className="footer-content">
                            <a href="#">Privacy Policy</a><a href="#">Term & Condition</a>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}

export default HomeComponent