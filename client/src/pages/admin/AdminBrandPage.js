import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Pagination from "../../components/Pagination";
import AdminBrandForm from "../../components/admin/brand/AdminBrandForm";
import Modal from "../../components/Modal";

import { alertError } from "../../helpers";
import { getHeaders } from "../../utils";
import { Helmet } from "react-helmet-async";

function AdminBrandPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname, search } = location;
    const urlSearchParams = new URLSearchParams(search);
    const s = urlSearchParams.get("s") || "";
    const page = Number(urlSearchParams.get("page")) || 1;
    const [searchString, setSearchString] = useState(s);
    const [totalPages, setTotalPages] = useState(0);

    const [brands, setBrands] = useState(null);
    const [brand, setBrand] = useState({});
    const [titleModal, setTitleModal] = useState("");
    const [createBrand, setCreateBrand] = useState(true);

    const getBrands = async () => {
        try {
            const { data } = await axios.get("/api/brand/listing", {
                params: { s: s, page: page },
                headers: getHeaders(),
            });
            setBrands(data.data);
            setTotalPages(data.totalPages);
        } catch (error) {
            alertError(error);
        }
    };
    const getBrand = async (id) => {
        try {
            const { data } = await axios.get(`/api/brand/${id}`, {
                headers: getHeaders(),
            });
            return data;
        } catch (error) {
            alertError(error);
        }
    };

    const handleDeteleBrand = async (id, name) => {
        try {
            if (window.confirm(`Bạn có chắc chắn muốn xóa thương hiệu '${name}' không ?`)) {
                await axios.delete(`/api/brand/${id}`, {
                    headers: getHeaders(),
                });
                getBrands();
            }
        } catch (error) {
            alertError(error);
        }
    };

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        const fetchData = async () => {
            try {
                const { data } = await axios.get("/api/brand/listing", {
                    params: { s: s, page: page },
                    headers: getHeaders(),
                });
                setBrands(data.data);
                setTotalPages(data.totalPages);
            } catch (error) {
                alertError(error);
            }
        };
        fetchData();
    }, [s, page]);

    return (
        <div className="card border-0 min-vh-100">
            <Helmet>
                <title>Quản lý thương hiệu</title>
            </Helmet>
            <div className="card-header d-flex justify-content-between">
                <h3>Quản lý thương hiệu</h3>
                <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#brand"
                    onClick={(e) => {
                        e.preventDefault();
                        setBrand({});
                        setTitleModal("Thêm mới Thương hiệu");
                        setCreateBrand(true);
                    }}
                >
                    Thêm mới
                </button>
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
                                <th scope="col">#</th>
                                <th scope="col">Icon</th>
                                <th scope="col" className="w-75">
                                    Tên thương hiệu
                                </th>
                                <th scope="col" colSpan={2}>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {brands &&
                                brands.length > 0 &&
                                brands.map((bra, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{bra.icon && <img src={bra.icon} alt={bra.name} height={50} />}</td>
                                        <td>{bra.name}</td>
                                        <td>
                                            <button
                                                className="btn btn-success"
                                                data-bs-toggle="modal"
                                                data-bs-target="#brand"
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    let bran = await getBrand(bra._id);
                                                    setBrand(bran);
                                                    setTitleModal("Chỉnh sửa Thương hiệu");
                                                    setCreateBrand(false);
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
                                                    handleDeteleBrand(bra._id, bra.name);
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
            <Modal id="brand" title={titleModal}>
                <AdminBrandForm actionAfterSubmit={getBrands} brand={brand} create={createBrand} update={!createBrand} />
            </Modal>
        </div>
    );
}

export default AdminBrandPage;
