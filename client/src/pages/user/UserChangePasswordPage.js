import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

function UserChangePasswordPage() {
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <div className="d-flex flex-column pt-2">
            <Helmet>
                <title>Đổi mật khẩu</title>
            </Helmet>
            <div className="ms-3 mb-3 border-bottom">
                <h3>Đổi mật khẩu</h3>
                <p className="">
                    Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho
                    người khác
                </p>
            </div>
            <div className="ms-5">
                <form className="">
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Mật khẩu cũ
                        </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="new-password" className="form-label">
                            Mật khẩu mới
                        </label>
                        <input
                            type="password"
                            name="new-password"
                            id="new-password"
                            className="form-control"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label
                            htmlFor="confirm-password"
                            className="form-label"
                        >
                            Nhập lại mật khẩu
                        </label>
                        <input
                            type="password"
                            name="confirm-password"
                            id="confirm-password"
                            className="form-control"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Đổi mật khẩu
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UserChangePasswordPage;
