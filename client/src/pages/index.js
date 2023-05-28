import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { removeAuthToken } from "../utils/localStorage";
import axios from "axios";
import { getHeaders } from "../utils";
import { Helmet } from "react-helmet-async";
import { ShopContext } from "../context/ShopContext";

function Index() {
    const navigate = useNavigate();
    const location = useLocation();
    const { search } = location;
    const urlSearchParams = new URLSearchParams(search);
    const sParam = urlSearchParams.get("s") || "";
    const [s, setS] = useState("");
    const [userInfo, setUserInfo] = useState({});
    const { state } = useContext(ShopContext);
    const {
        cart: { cartItems },
    } = state;

    useEffect(() => {
        setS(sParam);
    }, [sParam]);

    useEffect(() => {
        const getUser = async () => {
            try {
                const { data } = await axios.get("/api/auth/me", {
                    headers: getHeaders(),
                });
                setUserInfo(data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    removeAuthToken();
                } else {
                    console.log(error.message);
                }
            }
        };
        getUser();
    }, []);
    return (
        <>
            <Helmet>
                <title>HTA Shop</title>
            </Helmet>
            {/* navbar  */}
            <nav className="navbar navbar-expand-lg sticky-top bg-light border-bottom py-4 mb-4">
                <div className="container justify-content-between align-items-center ">
                    <Link to="/" className="navbar-brand h1 fs-1 d-flex gap-2">
                        <i className="bi bi-shop-window"></i> <span className="d-none d-md-block">HTA Shop</span>
                    </Link>
                    <form
                        className="d-flex w-50"
                        role="search"
                        onSubmit={(e) => {
                            e.preventDefault();
                            urlSearchParams.set("s", s);
                            urlSearchParams.set("page", 1);
                            navigate({
                                pathname: "/shop",
                                search: urlSearchParams.toString(),
                            });
                        }}
                    >
                        <input
                            className="form-control rounded-0"
                            type="search"
                            placeholder="Tìm kiếm sản phẩm"
                            aria-label="Search"
                            value={s}
                            onChange={(e) => setS(e.target.value)}
                        />
                        <button className="btn border border-1 rounded-0 bg-secondary" type="submit" title="search">
                            <i className="bi bi-search text-white fs-5"></i>
                        </button>
                    </form>
                    <div className="navbar-nav">
                        <Link to="/cart" className="nav-item btn position-relative me-2">
                            <i className="bi bi-cart fs-4"></i>
                            <span className="position-absolute top-0 end-0 badge rounded text-bg-danger">{cartItems.length}</span>
                        </Link>
                        <div className="nav-item dropdown">
                            <a href="#user" className="dropdown-toggle btn" data-bs-toggle="dropdown">
                                <i className="bi bi-person fs-4"></i>
                            </a>
                            {userInfo && userInfo.email ? (
                                <ul className="dropdown-menu dropdown-menu-end position-absolute">
                                    <li>
                                        <Link to="/user/profile" className="dropdown-item">
                                            Thông tin tài khoản
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/orders" className="dropdown-item">
                                            Đơn mua
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            className="dropdown-item"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeAuthToken();
                                                setUserInfo({});
                                                navigate("/");
                                            }}
                                        >
                                            Đăng xuất
                                        </button>
                                    </li>
                                </ul>
                            ) : (
                                <ul className="dropdown-menu dropdown-menu-end position-absolute">
                                    <li>
                                        <Link to="/login" className="dropdown-item">
                                            Đăng nhập
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/register" className="dropdown-item">
                                            Đăng kí
                                        </Link>
                                    </li>
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            {/* end of navbar  */}

            <Outlet />

            <footer className="border-top bg-light mt-auto">
                <div className="container">
                    <div className="d-flex flex-wrap justify-content-between py-4">
                        <div className="d-flex align-items-center justify-content-start">
                            <Link to="/" className="me-2 text-decoration-none lh-1 text-body">
                                <i className="bi bi-shop-window h4"></i>
                            </Link>
                            <span>
                                &copy; 2022, Copyright by <strong>HTA Shop</strong>
                            </span>
                        </div>
                        <ul className="nav align-items-center justify-content-end d-flex">
                            <li className="nav-item">
                                <a href="https://www.tiktok.com" target="blank" className="nav-link text-body">
                                    <i className="bi bi-tiktok h5"></i>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="https://www.instagram.com" target="blank" className="nav-link text-body">
                                    <i className="bi bi-instagram h5"></i>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="https://www.facebook.com" target="blank" className="nav-link text-body">
                                    <i className="bi bi-facebook h5"></i>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Index;
