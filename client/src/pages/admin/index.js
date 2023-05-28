import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import SideBar from "../../components/admin/SideBar";
import { getHeaders } from "../../utils";
import axios from "axios";
import { removeAuthToken } from "../../utils/localStorage";
import { alertError } from "../../helpers";

function AdminPage() {
    const navigate = useNavigate();
    const [adminInfo, setAdminInfo] = useState({});
    useEffect(() => {
        const getUser = async () => {
            try {
                const { data } = await axios.get("/api/auth/me", {
                    headers: getHeaders(),
                });
                if (data.role !== "Admin") {
                    navigate("/");
                    return;
                }
                setAdminInfo(data);
            } catch (error) {
                alertError(error, () => navigate("/login?redirect=/admin"));
            }
        };
        getUser();
    }, [navigate]);

    return adminInfo?.email ? (
        <>
            <header className="navbar navbar-dark sticky-top d-flex flex-nowrap bg-dark p-0 shadow">
                <Link
                    to="/admin"
                    className="navbar-brand bg-black d-flex gap-2 me-0 p-3 fs-6 me-2"
                >
                    <i className="bi bi-shop-window"></i>
                    <span className="">HTA Shop</span>
                </Link>
                <button
                    className="navbar-toggler d-md-none"
                    style={{ top: "8px", right: "15px" }}
                    data-bs-toggle="collapse"
                    data-bs-target="#sidebarMenu"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="w-100"></div>
                <div className="nav me-3">
                    <div className="nav-item text-nowrap dropdown">
                        <a
                            className="btn btn-outline-secondary dropdown-toggle"
                            href="#user"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="bi bi-person"></i>
                        </a>
                        <ul className="dropdown-menu dropdown-menu-end">
                            <li>
                                <Link
                                    to="/user/profile"
                                    className="dropdown-item"
                                >
                                    Thông tin tài khoản
                                </Link>
                            </li>
                            <li>
                                <button
                                    className="dropdown-item"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        removeAuthToken();
                                        setAdminInfo({});
                                        navigate("/login");
                                    }}
                                >
                                    Đăng xuất
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
            <div className="container-fluid">
                <div className="row">
                    {/* Sidebar  */}
                    <SideBar
                        id="sidebarMenu"
                        className="position-fixed col-md-3 col-lg-2 d-md-block bg-light min-vh-100 collapse"
                    />
                    {/* End of Sidebar  */}
                    {/* Content  */}
                    <main className="col-md-9 col-lg-10 ms-sm-auto p-0">
                        <Outlet />
                    </main>
                    {/* End of Content  */}
                </div>
            </div>
        </>
    ) : (
        <div></div>
    );
}

export default AdminPage;
