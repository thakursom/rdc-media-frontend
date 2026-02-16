import React from 'react'

function AddArtistComponent() {
    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="add-artist-sec">
                    <div className="artist-sec-heading">
                        <h6>Add Artist</h6>
                    </div>
                    <div className="artist-file-sec">
                        <div className="choose-artist-mainbox">
                            <div className="file-icon">
                                <i className="fa-solid fa-plus" />
                            </div>
                            <h5>Create New Artist</h5>
                        </div>
                    </div>
                    <div className="artist-sec-main">
                        <form className="artist-sec-form">
                            <div className="row">
                                <div className=" col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                                    <div className="form-group artist-form">
                                        <label className="form-label" htmlFor="name">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="David Doe"
                                            id="name"
                                        />
                                    </div>
                                </div>
                                <div className=" col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                                    <div className="form-group artist-form">
                                        <label className="form-label" htmlFor="email">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="David Doe"
                                            id="email"
                                        />
                                    </div>
                                </div>
                                <div className=" col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                                    <div className="form-group artist-form">
                                        <label className="form-label" htmlFor="music">
                                            Sound Cloud
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Music"
                                            id="music"
                                        />
                                    </div>
                                </div>
                                <div className=" col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                                    <div className="form-group artist-form">
                                        <label className="form-label" htmlFor="twitter">
                                            Twitter
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Music"
                                            id="twitter"
                                        />
                                    </div>
                                </div>
                                <div className=" col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                                    <div className="form-group artist-form">
                                        <label className="form-label" htmlFor="facebook">
                                            Facebook
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Music"
                                            id="facebook"
                                        />
                                    </div>
                                </div>
                                <div className=" col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                                    <div className="form-group artist-form">
                                        <label className="form-label" htmlFor="instagram">
                                            Instagram
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Music"
                                            id="instagram"
                                        />
                                    </div>
                                </div>
                                <div className=" col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                                    <div className="form-group artist-form">
                                        <label className="form-label" htmlFor="youtube">
                                            Youtube OAC
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Actor"
                                            id="youtube"
                                        />
                                    </div>
                                </div>
                                <div className=" col-md-6 col-lg-6 col-xl-4 col-xxl-4">
                                    <div className="form-group artist-form">
                                        <label className="form-label" htmlFor="website">
                                            Website
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Music"
                                            id="website"
                                        />
                                    </div>
                                </div>
                            </div>
                            <section className="sportify-main">
                                <div className="spotify-artist-page">
                                    <div className="spotify-heading">
                                        <h2>Spotify Artist Page</h2>
                                    </div>
                                    <div className="spotify-radio">
                                        <div className="spotify-radio-head">
                                            <h6>is this artist on spotify already?</h6>
                                        </div>
                                        <div className="artist-spotify-radio">
                                            <div className="form-group artist-radio">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="spotify"
                                                    id="spotify-radioYes"
                                                    defaultChecked=""
                                                />
                                                <label htmlFor="spotify-radioYes">
                                                    Yes, i can provide a link
                                                </label>
                                            </div>
                                            <div className="form-group artist-radio">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="spotify"
                                                    id="spotify-radioNo"
                                                />
                                                <label htmlFor="spotify-radioNo">
                                                    No, i need artist page created,(We will request a new artist
                                                    page be created for you. you must update the page info here
                                                    once live):
                                                </label>
                                            </div>
                                            <div className="form-group spotify-artist-link">
                                                <label htmlFor="spotifyArtist">Spotify Artist Link</label>
                                                <input
                                                    type="text"
                                                    id="spotifyArtist"
                                                    placeholder="Spotify Link"
                                                />
                                            </div>
                                            <div className="form-group spotify-artist-link">
                                                <label htmlFor="spotifyArtist">Facebook Page Link</label>
                                                <input
                                                    type="text"
                                                    id="spotifyArtist"
                                                    placeholder="Facebook Link"
                                                />
                                            </div>
                                            <div className="form-group spotify-artist-link">
                                                <label htmlFor="spotifyArtist">Instagram Page Link</label>
                                                <input
                                                    type="text"
                                                    id="spotifyArtist"
                                                    placeholder="Instagram Link"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="artist-cheaks-box">
                                    <div className="artist-check-main">
                                        <div className="artist-image">
                                            <img src="../assets/Img/artist.png" alt="Not found" />
                                        </div>
                                        <div className="artist-cheks form-check">
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Will Smith
                                            </label>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="ar-cheack"
                                                defaultValue=""
                                                id="flexCheckDefault"
                                                defaultChecked=""
                                            />
                                        </div>
                                    </div>
                                    <div className="artist-check-main">
                                        <div className="artist-image">
                                            <img src="../assets/Img/artist.png" alt="Not found" />
                                        </div>
                                        <div className="artist-cheks form-check">
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Will Smith
                                            </label>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue=""
                                                id="flexCheckDefault"
                                            />
                                        </div>
                                    </div>
                                    <div className="artist-check-main">
                                        <div className="artist-image">
                                            <img src="../assets/Img/artist.png" alt="Not found" />
                                        </div>
                                        <div className="artist-cheks form-check">
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Will Smith
                                            </label>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue=""
                                                id="flexCheckDefault"
                                            />
                                        </div>
                                    </div>
                                    <div className="artist-check-main">
                                        <div className="artist-image">
                                            <img src="../assets/Img/artist.png" alt="Not found" />
                                        </div>
                                        <div className="artist-cheks form-check">
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Will Smith
                                            </label>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue=""
                                                id="flexCheckDefault"
                                            />
                                        </div>
                                    </div>
                                    <div className="artist-check-main">
                                        <div className="artist-image">
                                            <img src="../assets/Img/artist.png" alt="Not found" />
                                        </div>
                                        <div className="artist-cheks form-check">
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Will Smith
                                            </label>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue=""
                                                id="flexCheckDefault"
                                            />
                                        </div>
                                    </div>
                                    <div className="artist-check-main">
                                        <div className="artist-image">
                                            <img src="../assets/Img/artist.png" alt="Not found" />
                                        </div>
                                        <div className="artist-cheks form-check">
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Will Smith
                                            </label>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue=""
                                                id="flexCheckDefault"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>
                            <section className="sportify-main">
                                <div className="spotify-artist-page">
                                    <div className="spotify-heading">
                                        <h2>Apple Artist Page</h2>
                                    </div>
                                    <div className="spotify-radio">
                                        <div className="spotify-radio-head">
                                            <h6>is this artist on Apple already?</h6>
                                        </div>
                                        <div className="artist-spotify-radio">
                                            <div className="form-group artist-radio">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="artist"
                                                    id="appleYes"
                                                    defaultChecked=""
                                                />
                                                <label htmlFor="appleYes">Yes, i can provide a link</label>
                                            </div>
                                            <div className="form-group artist-radio">
                                                <input
                                                    className="form-check-input"
                                                    type="radio"
                                                    name="artist"
                                                    id="appleNo"
                                                />
                                                <label htmlFor="appleNo">
                                                    No, i need artist page created,(We will request a new artist
                                                    page be created for you. you must update the page info here
                                                    once live):
                                                </label>
                                            </div>
                                            <div className="form-group spotify-artist-link">
                                                <label htmlFor="appleArtist">Apple Artist Link</label>
                                                <input
                                                    type="text"
                                                    id="appleArtist"
                                                    placeholder="Apple Link"
                                                />
                                            </div>
                                            <div className="form-group spotify-artist-link">
                                                <label htmlFor="spotifyArtist">Facebook Page Link</label>
                                                <input
                                                    type="text"
                                                    id="spotifyArtist"
                                                    placeholder="Facebook Link"
                                                />
                                            </div>
                                            <div className="form-group spotify-artist-link">
                                                <label htmlFor="spotifyArtist">Instagram Page Link</label>
                                                <input
                                                    type="text"
                                                    id="spotifyArtist"
                                                    placeholder="Instagram Link"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="apple-artist-cheaks-box">
                                    <div className="artist-check-main">
                                        <div className="artist-image">
                                            <img src="../assets/Img/artist.png" alt="Not found" />
                                        </div>
                                        <div className="artist-cheks form-check">
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Will Smith
                                            </label>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="ar-cheack"
                                                defaultValue=""
                                                id="flexCheckDefault"
                                            />
                                        </div>
                                    </div>
                                    <div className="artist-check-main">
                                        <div className="artist-image">
                                            <img src="../assets/Img/artist.png" alt="Not found" />
                                        </div>
                                        <div className="artist-cheks form-check">
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Will Smith
                                            </label>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue=""
                                                id="flexCheckDefault"
                                            />
                                        </div>
                                    </div>
                                    <div className="artist-check-main">
                                        <div className="artist-image">
                                            <img src="../assets/Img/artist.png" alt="Not found" />
                                        </div>
                                        <div className="artist-cheks form-check">
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Will Smith
                                            </label>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue=""
                                                id="flexCheckDefault"
                                            />
                                        </div>
                                    </div>
                                    <div className="artist-check-main">
                                        <div className="artist-image">
                                            <img src="../assets/Img/artist.png" alt="Not found" />
                                        </div>
                                        <div className="artist-cheks form-check">
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Will Smith
                                            </label>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue=""
                                                id="flexCheckDefault"
                                            />
                                        </div>
                                    </div>
                                    <div className="artist-check-main">
                                        <div className="artist-image">
                                            <img src="../assets/Img/artist.png" alt="Not found" />
                                        </div>
                                        <div className="artist-cheks form-check">
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Will Smith
                                            </label>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue=""
                                                id="flexCheckDefault"
                                            />
                                        </div>
                                    </div>
                                    <div className="artist-check-main">
                                        <div className="artist-image">
                                            <img src="../assets/Img/artist.png" alt="Not found" />
                                        </div>
                                        <div className="artist-cheks form-check">
                                            <label className="form-check-label" htmlFor="flexCheckDefault">
                                                Will Smith
                                            </label>
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                defaultValue=""
                                                id="flexCheckDefault"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="artist-btn-main">
                                    <button type="submit" className="btn artist-submit-btn">
                                        <a href="./addReleases2.html">Submit</a>
                                    </button>
                                </div>
                            </section>
                        </form>
                    </div>
                </div>
            </section>

        </>
    )
}

export default AddArtistComponent