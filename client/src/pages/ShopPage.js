import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import Breadcrumb from "../components/Breadcrumb";

import { useLocation, useNavigate, Link } from "react-router-dom";
import { alertError } from "../helpers";
import axios from "axios";
import { getHeaders } from "../utils";

function ShopPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname, search } = location;
    const urlSearchParams = new URLSearchParams(search);

    const sParam = urlSearchParams.get("s") || "";
    const pageParam = Number(urlSearchParams.get("page")) || 1;
    const priceMinParam = Number(urlSearchParams.get("price.min")) || 0;
    const priceMaxParam = Number(urlSearchParams.get("price.max")) || 0;
    const categoryParam = urlSearchParams.get("category") || "";
    const brandsParam =
        urlSearchParams.getAll("brands").length > 0
            ? JSON.stringify(urlSearchParams.getAll("brands"))
            : "[]";
    const sortParam = urlSearchParams.get("sort") || "createdAt";

    const [page, setPage] = useState(0);
    const [priceMin, setPriceMin] = useState(0);
    const [priceMax, setPriceMax] = useState(0);
    const [category, setCategory] = useState("");
    const [brands, setBrands] = useState([]);
    const [sort, setSort] = useState("");
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brandsSelect, setBrandsSelect] = useState([]);
    const [breadcrumb, setBreadcrumb] = useState([]);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        const getProducts = async () => {
            try {
                let sorted = { createdAt: -1 };
                switch (sortParam) {
                    case "createdAt":
                        sorted = { createdAt: -1 };
                        break;
                    case "priceAsc":
                        sorted = { price: 1 };
                        break;
                    case "priceDesc":
                        sorted = { price: -1 };
                        break;
                    case "countOfSold":
                        sorted = { countOfSold: -1 };
                        break;
                    case "rating":
                        sorted = { rating: -1 };
                        break;
                    default:
                        break;
                }
                const { data } = await axios.get(`/api/product/listing`, {
                    params: {
                        s: sParam,
                        page: pageParam,
                        price: { min: priceMinParam, max: priceMaxParam },
                        category: categoryParam,
                        brands: JSON.parse(brandsParam),
                        sort: sorted,
                    },
                    headers: getHeaders(),
                });
                setPage(pageParam);
                setPriceMin(priceMinParam);
                setPriceMax(priceMaxParam);
                setCategory(categoryParam);
                setBrands(JSON.parse(brandsParam));
                setSort(sortParam);
                setProducts(data.data);
                setTotalPages(data.totalPages);
                setCategories(data.categories);
                setBrandsSelect(data.brands);
                setBreadcrumb(data.breadcrumb);
            } catch (error) {
                alertError(error);
            }
        };
        getProducts();
    }, [
        sParam,
        pageParam,
        priceMinParam,
        priceMaxParam,
        categoryParam,
        brandsParam,
        sortParam,
    ]);

    return (
        <main className="container mb-4">
            <div className="row">
                <Breadcrumb data={breadcrumb} />
            </div>
            <div className="row mb-3 border-bottom">
                <div className="h5">Danh mục</div>
                <div className="d-flex mb-3 flex-wrap">
                    {categories && categories.length > 0 ? (
                        categories.map((cat, index) => {
                            const _searchParams = new URLSearchParams(search);
                            _searchParams.set("category", cat.slug);
                            _searchParams.delete("brands");
                            _searchParams.set("page", "1");
                            return (
                                <Link
                                    to={{
                                        pathname: pathname,
                                        search: _searchParams.toString(),
                                    }}
                                    key={index}
                                    className="btn btn-outline-primary ms-2 mb-2"
                                >
                                    {cat.name}
                                </Link>
                            );
                        })
                    ) : (
                        <p className="fw-lighter">(Trống)</p>
                    )}
                </div>
            </div>
            <div className="row mb-3 border-bottom">
                <div className="h5">Chọn theo tiêu chí</div>
                <div className="row ms-2">
                    <div className="col-2">Thương hiệu</div>
                    <div className="col-10">
                        <div className="d-flex flex-wrap mb-3">
                            {brandsSelect && brandsSelect.length > 0 ? (
                                brandsSelect.map((b, index) => (
                                    <div className="mb-2 ms-2" key={index}>
                                        <input
                                            type="checkbox"
                                            className="btn-check"
                                            id={b.slug}
                                            autoComplete="off"
                                            checked={brands.includes(b.slug)}
                                            readOnly
                                        />
                                        <label
                                            className="btn btn-outline-primary w-100 h-100"
                                            htmlFor={b.slug}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                const index = brands.indexOf(
                                                    b.slug
                                                );
                                                if (index !== -1) {
                                                    brands.splice(index, 1);
                                                } else {
                                                    brands.push(b.slug);
                                                }
                                                setBrands([...brands]);
                                            }}
                                        >
                                            {b.name}
                                        </label>
                                    </div>
                                ))
                            ) : (
                                <p className="fw-lighter">(Trống)</p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="row ms-2">
                    <div className="col-2">Khoảng giá</div>
                    <div className="col-10">
                        <div className="d-flex flex-wrap align-items-center">
                            <div className="me-3" style={{ width: "30%" }}>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="priceMin"
                                    placeholder="100000"
                                    value={priceMin !== 0 ? priceMin : ""}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setPriceMin(Number(e.target.value));
                                    }}
                                />
                            </div>
                            <span className="me-3 fs-4">
                                <i className="bi bi-dash"></i>
                            </span>

                            <div className="me-3" style={{ width: "30%" }}>
                                <input
                                    type="number"
                                    className="form-control"
                                    id="priceMax"
                                    placeholder="1000000"
                                    value={priceMax !== 0 ? priceMax : ""}
                                    onChange={(e) => {
                                        e.preventDefault();
                                        setPriceMax(Number(e.target.value));
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row ms-2 mb-3">
                    <div className="d-flex justify-content-end">
                        <button
                            className="btn btn-primary"
                            onClick={(e) => {
                                e.preventDefault();
                                const _searchParams = new URLSearchParams(
                                    search
                                );
                                _searchParams.delete("brands");
                                if (brands && brands.length > 0) {
                                    for (let bra of brands) {
                                        _searchParams.append("brands", bra);
                                    }
                                }
                                if (priceMin > 0) {
                                    _searchParams.set("price.min", priceMin);
                                }
                                if (priceMax > 0) {
                                    _searchParams.set("price.max", priceMax);
                                }
                                _searchParams.set("page", "1");
                                navigate({
                                    pathname: "/shop",
                                    search: _searchParams.toString(),
                                });
                            }}
                        >
                            Áp dụng
                        </button>
                    </div>
                </div>
            </div>
            <div className="row mb-4 border-bottom">
                <div className="h5">Sắp xếp theo</div>
                <div className="d-flex justify-content-start ms-2 gap-2 mb-3">
                    {[
                        { code: "createdAt", name: "Mới nhất" },
                        { code: "priceAsc", name: "Giá tăng dần ↑" },
                        { code: "priceDesc", name: "Giá giảm dần ↓" },
                        { code: "countOfSold", name: "Mua nhiều nhất" },
                        { code: "rating", name: "Đánh giá ↓" },
                    ].map((_sort, index) => {
                        const _searchParams = new URLSearchParams(search);
                        _searchParams.set("sort", _sort.code);
                        return (
                            <Link
                                key={index}
                                to={{
                                    pathname: pathname,
                                    search: _searchParams.toString(),
                                }}
                                className={
                                    sort === _sort.code
                                        ? "btn btn-primary"
                                        : "btn btn-outline-primary"
                                }
                            >
                                {_sort.name}
                            </Link>
                        );
                    })}
                </div>
            </div>
            <div className="row mb-3">
                {products &&
                    products.length > 0 &&
                    products.map((product, index) => (
                        <div
                            key={product._id}
                            className="col-6 col-xxl-2 col-lg-3 col-md-4"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
            </div>
            <div className="row mb-3">
                {totalPages > 0 && (
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onClick={(page) => {
                            urlSearchParams.set("page", page);
                            navigate({
                                pathname: "/shop",
                                search: urlSearchParams.toString(),
                            });
                        }}
                    />
                )}
            </div>
        </main>
    );
}

export default ShopPage;
