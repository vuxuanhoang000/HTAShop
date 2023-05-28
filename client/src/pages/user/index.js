import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

function UserPage() {
    const { pathname } = useLocation();

    return (
        <div className="container">
            <div className="row">
                <nav className="col-3 navbar fs-5">
                    <ul className="navbar-nav d-flex flex-column w-100 h-100">
                        <li className="nav-item">
                            <a href="#account" className="nav-link d-flex justify-content-between" data-bs-toggle="collapse">
                                <span className="">
                                    <i className="bi bi-person"></i> Tài khoản của tôi
                                </span>
                                <i className="bi bi-caret-down-fill"></i>
                            </a>
                            <ul className="collapse show" id="account">
                                <li className="nav-item">
                                    <Link to="/user/profile" className={pathname === "/user/profile" ? "nav-link active" : "nav-link"}>
                                        Hồ sơ
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link to="/user/change-password" className={pathname === "/user/change-password" ? "nav-link active" : "nav-link"}>
                                        Đổi mật khẩu
                                    </Link>
                                </li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link to="/orders" className={pathname === "/orders" ? "nav-link active" : "nav-link"}>
                                <span className="">
                                    <i className="bi bi-pass"></i> Đơn mua
                                </span>
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div className="col-9">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default UserPage;
