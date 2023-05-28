import React, { useState } from "react";
import { Helmet } from "react-helmet-async";

function UserProfilePage() {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [birth, setBirth] = useState("");
    return (
        <div className="d-flex flex-column pt-2">
            <Helmet>
                <title>Thông tin cá nhân</title>
            </Helmet>
            <div className="ms-3 mb-3 border-bottom">
                <h3>Hồ sơ của tôi</h3>
                <p className="">Quản lý thông tin hồ sơ để bảo mật tài khoản</p>
            </div>
            <div className="ms-5">
                <form className="">
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            readOnly
                            className="form-control"
                            value={email}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="firstName" className="form-label">
                            Họ và tên đệm
                        </label>
                        <input
                            type="text"
                            name="firstName"
                            id="firstName"
                            className="form-control"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="lastName" className="form-label">
                            Tên
                        </label>
                        <input
                            type="text"
                            name="lastName"
                            id="lastName"
                            className="form-control"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="gender" className="form-label">
                            Giới tính
                        </label>
                        <select
                            name="gender"
                            id="gender"
                            className="form-control"
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                        >
                            <option value="Nam">Nam</option>
                            <option value="Nữ">Nữ</option>
                            <option value="Không xác định">
                                Không xác định
                            </option>
                        </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="birth" className="form-label">
                            Ngày sinh
                        </label>
                        <input
                            type="date"
                            name="birth"
                            id="birth"
                            className="form-control"
                            value={birth}
                            onChange={(e) => setBirth(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Lưu thay đổi
                    </button>
                </form>
            </div>
        </div>
    );
}

export default UserProfilePage;
