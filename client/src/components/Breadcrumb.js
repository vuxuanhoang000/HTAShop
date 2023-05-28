import React from "react";
import { Link, createSearchParams } from "react-router-dom";

function Breadcrumb(props) {
    const { data, id, className } = props;
    return (
        <nav id={id} className={className} aria-label="breadcrumb">
            <ol className="breadcrumb">
                {data &&
                    data.length > 0 &&
                    data.map((b, index) => (
                        <li
                            key={index}
                            className={
                                index === data.length - 1
                                    ? "breadcrumb-item active"
                                    : "breadcrumb-item"
                            }
                            aria-current="page"
                        >
                            {index === data.length - 1 ? (
                                b.name
                            ) : (
                                <Link
                                    to={{
                                        pathname: "/shop",
                                        search: b.slug
                                            ? createSearchParams({
                                                  category: b.slug,
                                              }).toString()
                                            : "",
                                    }}
                                >
                                    {b.name}
                                </Link>
                            )}
                        </li>
                    ))}
            </ol>
        </nav>
    );
}

export default Breadcrumb;
