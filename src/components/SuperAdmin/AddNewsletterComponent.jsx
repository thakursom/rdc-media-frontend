import React from 'react'

function AddNewsletterComponent() {
    return (
        <>
            <section className="right-sidebar" id="sidebarRight">
                <div className="add-subLabel-sec">
                    <div className="add-subLab">
                        <div className="add-subLabel-heading">
                            <h6>Add Newsletter</h6>
                        </div>
                    </div>
                    <div className="add-newsLetter-mainbox">
                        <div className="chose-newsLetter-sec">
                            <div className="addNewsLetter">
                                <div className="file-icon">
                                    <i className="fa-solid fa-plus" />
                                </div>
                                <div className="chose-file-content">
                                    <h5>Add Image</h5>
                                </div>
                            </div>
                        </div>
                        <form className="add-Newsletter-form">
                            <div className="form-group add-NewsLetter-group">
                                <label className="form-label" htmlFor="title-artist">
                                    Title / Artist
                                </label>
                                <input className="form-control" type="text" id="title-artist" />
                            </div>
                            <div className="form-group add-NewsLetter-group">
                                <label className="form-label" htmlFor="short-desc">
                                    Short Description
                                </label>
                                <textarea
                                    className="form-control newsLetPlace"
                                    id="short-desc"
                                    defaultValue={""}
                                />
                            </div>
                            <div className="form-group add-NewsLetter-button">
                                <button
                                    type="submit"
                                    className="btn newsLetter"
                                    id="newsLetterSubmit"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>

        </>
    )
}

export default AddNewsletterComponent
