import axios from "axios";
import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import { alertError } from "../../helpers";
import { setAuthToken } from "../../utils/localStorage";
import { getHeaders } from "../../utils";

function RegisterPage(props) {
    const navigate = useNavigate();
    const { redirect } = useOutletContext();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Mật khẩu và nhập lại mật khẩu không trùng khớp!");
            return;
        }
        try {
            const { data } = await axios.post(
                "/api/auth/register",
                {
                    email,
                    password,
                    firstName,
                    lastName,
                },
                {
                    headers: getHeaders(),
                }
            );
            setAuthToken(data.token);
            alert("Đăng ký thành công");
            navigate(redirect);
        } catch (error) {
            alertError(error);
        }
    };

    return (
        <>
            <Helmet>
                <title>Đăng kí - HTA Shop</title>
            </Helmet>
            <div className="d-flex align-items-center justify-content-between mb-5">
                <Link to="/" className="h3 text-decoration-none">
                    <i className="bi bi-hash"></i>
                    HTA Shop
                </Link>
                <h3>Đăng kí</h3>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="firstName"
                        placeholder="Nguyễn Văn"
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <label htmlFor="firstName">Họ và tên đệm</label>
                </div>
                <div className="form-floating mb-3">
                    <input
                        type="text"
                        className="form-control"
                        id="lastName"
                        placeholder="A"
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <label htmlFor="lastName">Tên</label>
                </div>
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
                <div className="form-floating mb-3">
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <label htmlFor="confirmPassword">Mật khẩu</label>
                </div>

                <button
                    type="submit"
                    className="btn btn-primary py-3 w-100 mb-4"
                >
                    Đăng kí
                </button>
            </form>
            <p className="text-end">
                Bạn đã có tài khoản? <Link to="/auth/login">Đăng nhập</Link>
            </p>
        </>
    );
}

export default RegisterPage;
