import React from "react";
import { Link, useLocation } from "react-router-dom";

function SideBar({ id, className }) {
    let { pathname } = useLocation();
    return (
        <nav
            id={id}
            className={`navbar align-items-start justify-content-center ${className}`}
            style={{ zIndex: "100" }}
        >
            <div className="position-sticky">
                <ul className="navbar-nav flex-column px-3 mb-5">
                    <li className="nav-item">
                        <Link
                            to="/admin"
                            className={
                                pathname === "/admin"
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                            aria-current="page"
                        >
                            <i className="bi bi-shop"></i> Trang chủ
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            to="/admin/orders"
                            className={
                                pathname.startsWith("/admin/orders")
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                            aria-current="page"
                        >
                            <i className="bi bi-cart3"></i> Đơn hàng
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link
                            to="/admin/users"
                            className={
                                pathname === "/admin/users"
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                            aria-current="page"
                        >
                            <i className="bi bi-people"></i> Người dùng
                        </Link>
                    </li>
                    <li className="nav-item">
                        <a
                            href="#catalog"
                            role="button"
                            className="nav-link d-flex justify-content-between "
                            data-bs-toggle="collapse"
                            aria-expanded="true"
                        >
                            <span>
                                <i className="bi bi-database"></i> Hệ thống
                            </span>
                            <i className="bi bi-caret-down-fill"></i>
                        </a>
                        <ul className="collapse show" id="catalog">
                            <li className="nav-item">
                                <Link
                                    to="/admin/categories"
                                    className={
                                        pathname.startsWith("/admin/categories")
                                            ? "nav-link active"
                                            : "nav-link"
                                    }
                                    aria-current="page"
                                >
                                    <i className="bi bi-list-ul"></i> Danh mục
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    to="/admin/brands"
                                    className={
                                        pathname.startsWith("/admin/brands")
                                            ? "nav-link active"
                                            : "nav-link"
                                    }
                                    aria-current="page"
                                >
                                    <i className="bi bi-tags"></i> Thương hiệu
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link
                                    to="/admin/products"
                                    className={
                                        pathname.startsWith("/admin/product")
                                            ? "nav-link active"
                                            : "nav-link"
                                    }
                                    aria-current="page"
                                >
                                    <i className="bi bi-table"></i> Sản phẩm
                                </Link>
                            </li>
                        </ul>
                    </li>

                    <li className="nav-item">
                        <Link
                            to="/admin/carousels"
                            className={
                                pathname.startsWith("/admin/carousels")
                                    ? "nav-link active"
                                    : "nav-link"
                            }
                            aria-current="page"
                        >
                            <i className="bi bi-sliders"></i> Carousels
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default SideBar;
