import React from "react";
import ReactPaginate from "react-paginate";
import "./CustomPagination.css";

function CustomPagination({
    pageCount,
    onPageChange,
    currentPage,
    perPage,
    onPerPageChange
}) {
    return (
        <div className="pagination-wrapper">
            {/* Left: Rows per page */}
            <div className="rows-per-page">
                <span>Rows per page:</span>
                <select
                    value={perPage}
                    onChange={(e) => onPerPageChange(Number(e.target.value))}
                    className="rows-select"
                >
                    <option value={10}>10</option>
                    <option value={15}>15</option>
                    <option value={25}>25</option>
                    <option value={50}>50</option>
                </select>
            </div>

            {/* Right: Pagination */}
            <ReactPaginate
                previousLabel={"← Previous"}
                nextLabel={"Next →"}
                pageCount={pageCount}
                onPageChange={(data) => onPageChange(data.selected + 1)}
                marginPagesDisplayed={2}
                pageRangeDisplayed={3}
                containerClassName="custom-pagination"
                activeClassName="custom-active"
                pageClassName="custom-page"
                previousClassName="custom-page"
                nextClassName="custom-page"
                disabledClassName="custom-disabled"
                forcePage={currentPage - 1}
            />
        </div>
    );
}

export default CustomPagination;
