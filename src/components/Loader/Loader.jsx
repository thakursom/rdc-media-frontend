import React from 'react';
import './Loader.css';

/**
 * Common Loader component
 * @param {Object} props
 * @param {boolean} props.fullPage - If true, displays as a full-page overlay
 * @param {string} props.message - Optional message to display
 * @param {string} props.variant - Bootstrap color variant (primary, success, etc.)
 */
const Loader = ({ fullPage = false, message = 'Loading...', variant = 'primary' }) => {
    const loaderContent = (
        <div className="loader-content text-center">
            <div className={`spinner-border text-${variant}`} role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            {message && <p className="mt-2 loader-message">{message}</p>}
        </div>
    );

    if (fullPage) {
        return (
            <div className="loader-overlay">
                {loaderContent}
            </div>
        );
    }

    return (
        <div className="loader-container py-5">
            {loaderContent}
        </div>
    );
};

export default Loader;
