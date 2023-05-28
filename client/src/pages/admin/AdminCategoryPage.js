import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "../../components/Modal";
import AdminCategoryForm from "../../components/admin/category/AdminCategoryForm";

import { alertError, treeToList } from "../../helpers";
import { getHeaders } from "../../utils";
import { Helmet } from "react-helmet-async";

function AdminCategoryPage() {
    const [categories, setCategories] = useState(null);
    const [category, setCategory] = useState({});
    const [maxLevel, setMaxLevel] = useState(0);

    const [titleModal, setTitleModal] = useState("");
    const [createCategory, setCreateCategory] = useState(true);

    const fetchData = async () => {
        try {
            const { data } = await axios.get("/api/category/tree", {
                headers: getHeaders(),
            });
            const { list: listCategories, maxLevel: maxLev } = treeToList(data);
            setCategories(listCategories);
            setMaxLevel(maxLev);
        } catch (error) {
            alertError(error);
        }
    };

    const handelDeleteCategory = async (id, name) => {
        try {
            if (window.confirm(`Bạn có chắc chắn muốn xóa danh mục '${name}' không ?`)) {
                await axios.delete(`/api/category/${id}`, {
                    headers: getHeaders(),
                });
                fetchData();
            }
        } catch (error) {
            alertError(error);
        }
    };
    const getCategory = async (id) => {
        try {
            const { data } = await axios.get(`/api/category/${id}`, {
                headers: getHeaders(),
            });
            return data;
        } catch (error) {
            alertError(error);
        }
    };
    useEffect(() => {
        fetchData();
    }, []);
    return (
        <div className="card border-0 min-vh-100">
            <Helmet>
                <title>Quản lý danh mục</title>
            </Helmet>
            <div className="card-header d-flex justify-content-between">
                <h3>Quản lý danh mục</h3>
                <button
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#category"
                    onClick={(e) => {
                        e.preventDefault();
                        setCategory({});
                        setTitleModal("Thêm mới Danh mục");
                        setCreateCategory(true);
                    }}
                >
                    Thêm mới
                </button>
            </div>
            <div className="card-body">
                <div className="container-fluid">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col" colSpan={maxLevel} className="w-75">
                                    Danh mục
                                </th>
                                <th scope="col" colSpan={2}>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Cấp độ</th>
                                {[...Array(maxLevel)].map((value, index) => (
                                    <th key={index}>{index + 1}</th>
                                ))}
                                <td></td>
                                <td></td>
                            </tr>
                            {categories &&
                                categories.length > 0 &&
                                categories.map((cat, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        {cat.level !== 1 && <td colSpan={cat.level - 1}></td>}
                                        <td colSpan={maxLevel - cat.level + 1} className="gap-2">
                                            {cat.icon && <img src={cat.icon} alt={cat.name} width={30} height={30} className="rounded-5 me-2" />}
                                            <span>{cat.name}</span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-success"
                                                data-bs-toggle="modal"
                                                data-bs-target="#category"
                                                onClick={async (e) => {
                                                    e.preventDefault();
                                                    let cate = await getCategory(cat._id);
                                                    setCategory(cate);
                                                    setTitleModal("Chỉnh sửa Danh mục");
                                                    setCreateCategory(false);
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
                                                    handelDeleteCategory(cat._id, cat.name);
                                                }}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal id="category" title={titleModal}>
                <AdminCategoryForm actionAfterSubmit={fetchData} category={category} create={createCategory} update={!createCategory} />
            </Modal>
        </div>
    );
}

export default AdminCategoryPage;
