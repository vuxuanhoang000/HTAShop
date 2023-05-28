import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import axios from "axios";
import { setAuthToken } from "../../utils/localStorage";
import { alertError } from "../../helpers";
import { getHeaders } from "../../utils";

function LoginPage(props) {
    const navigate = useNavigate();
    const { redirect } = useOutletContext();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(
                "/api/auth/login",
                {
                    email,
                    password,
                },
                {
                    headers: getHeaders(),
                }
            );
            setAuthToken(data.token);
            navigate(redirect);
        } catch (error) {
            alertError(error);
        }
    };
    return (
        <>
            <Helmet>
                <title>Đăng nhập - HTA Shop</title>
            </Helmet>
            <div className="d-flex align-items-center justify-content-between mb-5">
                <Link to="/" className="h3 text-decoration-none">
                    <i className="bi bi-hash"></i>
                    HTA Shop
                </Link>
                <h3>Đăng nhập</h3>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="name@example.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor="email">Địa chỉ Email</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="password">Mật khẩu</label>
                </div>
                <div className="d-flex justify-content-between mb-3">
                    <div className="form-check">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="rememberMe"
                        />
                        <label
                            className="form-check-label"
                            htmlFor="rememberMe"
                        >
                            Nhớ mật khẩu
                        </label>
                    </div>

                    <Link to="/forgot-password">Quên mật khẩu?</Link>
                </div>
                <button
                    type="submit"
                    className="btn btn-primary py-3 w-100 mb-4"
                >
                    Đăng nhập
                </button>
            </form>
            <p className="text-end">
                Bạn chưa có tài khoản? <Link to="/register">Đăng kí</Link>
            </p>
        </>
    );
}

export default LoginPage;
