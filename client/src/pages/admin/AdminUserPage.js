import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getHeaders } from "../../utils";
import { alertError } from "../../helpers";
import { Helmet } from "react-helmet-async";
import Pagination from "../../components/Pagination";

function AdminUserPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname, search } = location;
    const urlSearchParams = new URLSearchParams(search);
    const s = urlSearchParams.get("s") || "";
    const page = Number(urlSearchParams.get("page")) || 1;
    const [searchString, setSearchString] = useState(s);
    const [totalPages, setTotalPages] = useState(0);

    const [users, setUsers] = useState(null);
    useEffect(() => {
        const getUsers = async () => {
            try {
                const { data } = await axios.get(`/api/user/listing`, {
                    headers: getHeaders(),
                    params: { s: s, page: page },
                });
                setUsers(data.data);
                setTotalPages(data.totalPages);
            } catch (error) {
                alertError(error);
            }
        };
        getUsers();
    }, [s, page]);
    return (
        <div className="card border-0 min-vh-100">
            <Helmet>
                <title>Quản lý người dùng</title>
            </Helmet>
            <div className="card-header d-flex justify-content-between">
                <h3 className="">Quản lý người dùng</h3>
            </div>
            <div className="card-body">
                <div className="container-fluid">
                    <form
                        className="d-flex mb-4"
                        onSubmit={async (e) => {
                            e.preventDefault();
                            navigate(`${pathname}?s=${searchString}&page=${page}`);
                        }}
                    >
                        <input
                            type="search"
                            name="s"
                            id="searchString"
                            value={searchString}
                            className="form-control me-2"
                            onChange={(e) => {
                                setSearchString(e.target.value);
                            }}
                        />
                        <button className="btn btn-outline-secondary" type="submit">
                            <i className="bi bi-search"></i>
                        </button>
                    </form>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Họ và tên đệm</th>
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Vai trò</th>
                                <th>Ngày gia nhập</th>
                                <th colSpan={2}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users?.length > 0 &&
                                users.map((user, index) => (
                                    <tr key={index}>
                                        <th>{index + 1}</th>
                                        <td>{user.profile.firstName}</td>
                                        <td>{user.profile.lastName}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{user.createdAt.substring(0, 10)}</td>
                                        <td>
                                            <button
                                                className="btn btn-success"
                                                data-bs-toggle="modal"
                                                data-bs-target="#brand"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                }}
                                            >
                                                <i className="bi bi-pencil-square"></i>
                                            </button>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-danger"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                }}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                    <div className="d-flex align-items-center justify-content-center">
                        <Pagination page={page} totalPages={totalPages} onClick={() => navigate(`${pathname}?s=${searchString}&page=${page}`)} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminUserPage;
