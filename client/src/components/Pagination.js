import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

function Pagination(props) {
    const { page, totalPages } = props;
    const location = useLocation();
    const { pathname, search } = location;
    const [searchString, setSearchString] = useState({});
    useEffect(() => {
        let _pages = [
            1,
            page - 2,
            page - 1,
            page,
            page + 1,
            page + 2,
            totalPages,
        ];
        let searchs = [];
        for (let _p of _pages) {
            let _urls = new URLSearchParams(search);
            _urls.set("page", _p);
            searchs.push(_urls.toString());
        }
        setSearchString(searchs);
    }, [page, search, totalPages]);
    return (
        <nav
            className="overflow-auto d-flex justify-content-center"
            aria-label="Page navigation"
        >
            {totalPages > 0 && searchString.length > 6 && (
                <ul className="pagination">
                    <li
                        className={
                            page < 2 ? "page-item disabled" : "page-item"
                        }
                    >
                        <Link
                            to={{ pathname: pathname, search: searchString[2] }}
                            className="page-link"
                            aria-label="Previous"
                            disabled={page < 2}
                        >
                            <span aria-hidden="true">&laquo;</span>
                        </Link>
                    </li>
                    <li
                        className={
                            page === 1 ? "page-item active" : "page-item"
                        }
                    >
                        <Link
                            to={{ pathname: pathname, search: searchString[0] }}
                            className="page-link"
                        >
                            1
                        </Link>
                    </li>
                    {page - 3 > 1 && (
                        <li className="page-item disable">
                            <button className="page-link" disabled>
                                ...
                            </button>
                        </li>
                    )}
                    {page - 2 > 1 && (
                        <li className="page-item disable">
                            <Link
                                to={{
                                    pathname: pathname,
                                    search: searchString[1],
                                }}
                                className="page-link"
                            >
                                {page - 2}
                            </Link>
                        </li>
                    )}
                    {page - 1 > 1 && (
                        <li className="page-item disable">
                            <Link
                                to={{
                                    pathname: pathname,
                                    search: searchString[2],
                                }}
                                className="page-link"
                            >
                                {page - 1}
                            </Link>
                        </li>
                    )}
                    {page !== 1 && page !== totalPages && (
                        <li className="page-item active">
                            <button className="page-link" disabled>
                                {page}
                            </button>
                        </li>
                    )}
                    {page + 1 < totalPages && (
                        <li className="page-item disable">
                            <Link
                                to={{
                                    pathname: pathname,
                                    search: searchString[4],
                                }}
                                className="page-link"
                            >
                                {page + 1}
                            </Link>
                        </li>
                    )}
                    {page + 2 < totalPages && (
                        <li className="page-item disable">
                            <Link
                                to={{
                                    pathname: pathname,
                                    search: searchString[5],
                                }}
                                className="page-link"
                            >
                                {page + 2}
                            </Link>
                        </li>
                    )}
                    {page + 3 < totalPages && (
                        <li className="page-item disable">
                            <button className="page-link" disabled>
                                ...
                            </button>
                        </li>
                    )}
                    {totalPages > 1 && (
                        <li
                            className={
                                page === totalPages
                                    ? "page-item active"
                                    : "page-item"
                            }
                        >
                            <Link
                                to={{
                                    pathname: pathname,
                                    search: searchString[6],
                                }}
                                className="page-link"
                            >
                                {totalPages}
                            </Link>
                        </li>
                    )}
                    <li
                        className={
                            page >= totalPages
                                ? "page-item disabled"
                                : "page-item"
                        }
                    >
                        <Link
                            to={{ pathname: pathname, search: searchString[4] }}
                            className="page-link"
                            aria-label="Next"
                            disabled={page >= totalPages}
                        >
                            <span aria-hidden="true">&raquo;</span>
                        </Link>
                    </li>
                </ul>
            )}
        </nav>
    );
}

export default Pagination;
