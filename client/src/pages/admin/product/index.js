import React, { useEffect, useState } from "react";
import AdminProductCard from "../../../components/admin/product/AdminProductCard";
import {
    Link,
    useLocation,
    createSearchParams,
    useNavigate,
} from "react-router-dom";
import { alertError } from "../../../helpers";
import axios from "axios";
import Pagination from "../../../components/Pagination";
import { getHeaders } from "../../../utils";
import { Helmet } from "react-helmet-async";

function AdminProductsPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname, search } = location;
    const urlSearchParams = new URLSearchParams(search);
    const s = urlSearchParams.get("s");
    const page = Number(urlSearchParams.get("page")) || 1;

    const [searchString, setSearchString] = useState("");
    const [limit, setLimit] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        const getProducts = async () => {
            try {
                const { data } = await axios.get(`/api/product/listing`, {
                    params: { s: s, page: page },
                    headers: getHeaders(),
                });
                setProducts(data.data);
                setLimit(data.limit);
                setTotalPages(data.totalPages);
                setSearchString(s);
            } catch (error) {
                alertError(error);
            }
        };
        getProducts();
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }, [s, page]);

    return (
        <div className="card border-0 min-vh-100">
            <Helmet>
                <title>Quản lý sản phẩm</title>
            </Helmet>
            <div className="card-header d-flex flex-column">
                <div className="d-flex justify-content-between mb-3">
                    <h3>Sản phẩm trong của hàng</h3>
                    <Link to="/admin/product/new" className="btn btn-primary">
                        Thêm sản phẩm mới
                    </Link>
                </div>

                <form
                    className="d-flex justify-content-between"
                    onSubmit={(e) => {
                        e.preventDefault();
                        urlSearchParams.set("s", searchString);
                        urlSearchParams.set("page", 1);
                        navigate({
                            pathname: "/admin/products",
                            search: urlSearchParams.toString(),
                        });
                    }}
                >
                    <input
                        className="form-control rounded-0"
                        type="search"
                        placeholder="Tìm kiếm sản phẩm"
                        aria-label="Search"
                        value={searchString}
                        onChange={(e) => setSearchString(e.target.value)}
                    />
                    <button
                        className="btn border border-1 rounded-0 bg-secondary"
                        type="submit"
                        title="search"
                    >
                        <i className="bi bi-search text-white fs-5"></i>
                    </button>
                </form>
            </div>
            <div className="card-body">
                <div className="container-fluid">
                    <div className="row">
                        {products && products.length > 0 ? (
                            products.map((product, index) => (
                                <div
                                    key={index}
                                    className="col-6 col-xxl-2 col-lg-3 col-md-4"
                                >
                                    <AdminProductCard
                                        product={product}
                                        onDelete={() => {
                                            navigate(0);
                                        }}
                                    />
                                </div>
                            ))
                        ) : (
                            <div className="vh-100">
                                <h1>(Trống)</h1>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="card-footer justify-content-start">
                <Pagination
                    page={page}
                    totalPages={totalPages}
                    onClick={(page) =>
                        navigate({
                            pathname: pathname,
                            search: createSearchParams({
                                s: searchString,
                                page: page,
                            }).toString(),
                        })
                    }
                />
            </div>
        </div>
    );
}

export default AdminProductsPage;
