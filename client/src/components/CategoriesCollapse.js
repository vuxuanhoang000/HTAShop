import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, createSearchParams } from "react-router-dom";
import { alertError } from "../helpers";
import { getHeaders } from "../utils";

function CategoriesCollapse(props) {
    const { id, className, style } = props;
    const [categories, setCategories] = useState(null);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const { data } = await axios.get("/api/category/tree", {
                    headers: getHeaders(),
                });
                setCategories(data);
            } catch (error) {
                alertError(error);
            }
        };
        getCategories();
    }, []);

    return (
        <nav id={id} className={`navbar ${className}`} style={style}>
            <a
                href="#categories"
                role="button"
                className="btn d-flex align-items-center justify-content-between w-100 px-3 py-2"
                data-bs-toggle="collapse"
                aria-expanded="true"
            >
                <h5 className="">Danh mục</h5>
                <i className="bi bi-caret-down-fill"></i>
            </a>
            <div className="collapse w-100 show" id="categories">
                <ul className="navbar flex-column w-100">
                    {categories &&
                        categories.length > 0 &&
                        categories.map((category1) => (
                            <li
                                key={category1._id}
                                className={
                                    category1.children &&
                                    category1.children.length > 0
                                        ? "nav-item border-top w-100 px-3 py-2 btn-group dropdown-submenu "
                                        : "nav-item border-top w-100 px-3 py-2 btn-group"
                                }
                            >
                                <Link
                                    to={{
                                        pathname: "/shop",
                                        search: createSearchParams({
                                            category: category1.slug,
                                        }).toString(),
                                    }}
                                    className="nav-link active w-100"
                                >
                                    {category1.icon && (
                                        <img
                                            src={category1.icon}
                                            alt={category1.name}
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                            }}
                                            className="rounded-5 me-2"
                                        />
                                    )}
                                    {category1.name}
                                </Link>

                                {category1.children &&
                                    category1.children.length > 0 && (
                                        <ul
                                            className="dropdown-menu multi-level"
                                            role="menu"
                                        >
                                            {category1.children.map(
                                                (category2) => (
                                                    <li
                                                        key={category2._id}
                                                        className={
                                                            category2.children &&
                                                            category2.children
                                                                .length > 0
                                                                ? "border-top dropdown-submenu"
                                                                : "border-top"
                                                        }
                                                    >
                                                        <Link
                                                            to={{
                                                                pathname:
                                                                    "/shop",
                                                                search: createSearchParams(
                                                                    {
                                                                        category:
                                                                            category2.slug,
                                                                    }
                                                                ).toString(),
                                                            }}
                                                            className="dropdown-item"
                                                        >
                                                            {category2.icon && (
                                                                <img
                                                                    src={
                                                                        category2.icon
                                                                    }
                                                                    alt={
                                                                        category2.name
                                                                    }
                                                                    style={{
                                                                        width: "30px",
                                                                        height: "30px",
                                                                    }}
                                                                    className="rounded-5 mx-2"
                                                                />
                                                            )}
                                                            {category2.name}
                                                        </Link>
                                                        {category2.children &&
                                                            category2.children
                                                                .length > 0 && (
                                                                <ul className="dropdown-menu">
                                                                    {category2.children.map(
                                                                        (
                                                                            category3
                                                                        ) => (
                                                                            <li
                                                                                key={
                                                                                    category3._id
                                                                                }
                                                                                className="border-top"
                                                                            >
                                                                                <Link
                                                                                    to={{
                                                                                        pathname:
                                                                                            "/shop",
                                                                                        search: createSearchParams(
                                                                                            {
                                                                                                category:
                                                                                                    category3.slug,
                                                                                            }
                                                                                        ).toString(),
                                                                                    }}
                                                                                    className="dropdown-item"
                                                                                >
                                                                                    {category3.icon && (
                                                                                        <img
                                                                                            src={
                                                                                                category3.icon
                                                                                            }
                                                                                            alt={
                                                                                                category3.name
                                                                                            }
                                                                                            style={{
                                                                                                width: "30px",
                                                                                                height: "30px",
                                                                                            }}
                                                                                            className="rounded-5 mx-2"
                                                                                        />
                                                                                    )}
                                                                                    {
                                                                                        category3.name
                                                                                    }
                                                                                </Link>
                                                                            </li>
                                                                        )
                                                                    )}
                                                                </ul>
                                                            )}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                            </li>
                        ))}
                </ul>
            </div>
        </nav>
    );
}

export default CategoriesCollapse;
