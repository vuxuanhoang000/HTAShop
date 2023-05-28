import React, { useContext, useEffect, useState } from "react";
import { Link, createSearchParams, useParams } from "react-router-dom";

import { alertError, formatCurrency } from "../helpers";
import axios from "axios";
import InputQuantity from "../components/InputQuantity";
import OwlCarousel from "../components/OwlCarousel";
import ProductCard from "../components/ProductCard";
import { Helmet } from "react-helmet-async";
import { getHeaders } from "../utils";
import { CART_ADD_ITEM, ShopContext } from "../context/ShopContext";

function ProductDetailPage() {
    const { slug } = useParams();
    const { dispatch } = useContext(ShopContext);
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [option, setOption] = useState({});
    const [childSelected, setChildSelected] = useState({});
    const [productSuggest, setProductSuggest] = useState(null);

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
        const getProduct = async () => {
            try {
                const { data: _product } = await axios.get(`/api/product/${slug}`, {
                    headers: getHeaders(),
                });

                setProduct(_product);
                setOption({});
                setQuantity(1);
                setChildSelected(_product.children[0]);
                if (_product.category && _product.category._id) {
                    const { data } = await axios.get("/api/product/listing", {
                        params: {
                            category: _product.category._id,
                            page: 1,
                            limit: 12,
                        },
                        headers: getHeaders(),
                    });
                    setProductSuggest(data.data);
                }
            } catch (error) {
                alertError(error);
            }
        };
        getProduct();
    }, [slug]);
    const handleAddToCart = async (e) => {
        e.preventDefault();
        if (Object.keys(option).length !== product.options.length) {
            window.alert("Hãy chọn sản phẩm muốn mua.");
            return;
        }
        if (childSelected?._id) {
            const { data } = await axios.get(`/api/product/child/${childSelected._id}`);

            if (data.countInStock < quantity) {
                window.alert("Rất tiếc, Sản phẩm đã hết hàng");
                return;
            }
            dispatch({
                type: CART_ADD_ITEM,
                payload: { _id: childSelected._id, quantity: quantity },
            });
        }
    };
    return (
        <div className="container mb-4">
            <Helmet>
                <title>{product && product.name ? `${product.name} - ` : ""}HTA Shop</title>
            </Helmet>
            <div className="row mb-3 border-bottom">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        {product &&
                            product.breadcrumb &&
                            product.breadcrumb.length > 0 &&
                            product.breadcrumb.map((b, index) => (
                                <li key={index} className="breadcrumb-item" aria-current="page">
                                    <Link
                                        to={{
                                            pathname: "/shop",
                                            search: b.slug
                                                ? createSearchParams({
                                                      category: b.slug,
                                                  }).toString()
                                                : "",
                                        }}
                                    >
                                        {b.name}
                                    </Link>
                                </li>
                            ))}
                        {product && product.name && (
                            <li className="breadcrumb-item">
                                <p className="text-truncate">{product.name}</p>
                            </li>
                        )}
                    </ol>
                </nav>
            </div>
            <div className="row mb-3 border-bottom">
                <div className="col-lg-5 mb-3">
                    <div id="carouselIamgesControls" className="carousel slide" data-bs-ride="carousel">
                        <div className="carousel-inner">
                            {product &&
                                product.images &&
                                product.images.length > 0 &&
                                product.images.map((img, index) => (
                                    <div key={index} className={index === 0 ? "carousel-item active" : "carousel-item"}>
                                        <img src={img.name} alt="" className="d-block w-100" />
                                    </div>
                                ))}
                        </div>
                        <button className="carousel-control-prev" type="button" data-bs-target="#carouselIamgesControls" data-bs-slide="prev">
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Previous</span>
                        </button>
                        <button className="carousel-control-next" type="button" data-bs-target="#carouselIamgesControls" data-bs-slide="next">
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="visually-hidden">Next</span>
                        </button>
                    </div>
                </div>
                <div className="col-lg-7 mb-3">
                    {product && product.name && <h3 className="mb-3">{product.name}</h3>}
                    <div className="d-flex mb-3">
                        {product && product.rating >= 0 && (
                            <h6 className="card-subtitle text-muted pe-2">
                                {[...Array(5)].map((v, i) => (
                                    <i
                                        key={i}
                                        className={
                                            product.rating >= i + 1
                                                ? "bi bi-star-fill text-warning"
                                                : product.rating >= i + 0.5
                                                ? "bi bi-star-half text-warning"
                                                : "bi bi-star text-warning"
                                        }
                                    ></i>
                                ))}
                            </h6>
                        )}
                        {product && product.countOfReviews >= 0 && (
                            <div className="fw-lighter text-truncate">{product.countOfReviews > 0 ? `(${product.countOfReviews} đánh giá)` : "(chưa có đánh giá)"}</div>
                        )}
                        {product && product.countOfSold >= 0 && <div className="fw-lighter ms-2"> | Đã bán {product.countOfSold}</div>}
                    </div>
                    {childSelected && childSelected.price >= 0 && childSelected.discount >= 0 && (
                        <div className="d-flex gap-1 bg-light align-items-center mb-3">
                            <div className="text-danger fs-2 fw-bold me-2">{formatCurrency(childSelected.price - childSelected.discount)}</div>
                            {childSelected.discount > 0 && (
                                <>
                                    <div className="fw-lighter text-decoration-line-through">{formatCurrency(childSelected.price)}</div>
                                    <div className="text-danger">- {Math.ceil((childSelected.discount / childSelected.price) * 100)}%</div>
                                </>
                            )}
                        </div>
                    )}
                    {product && product.options && product.options.length > 0 && (
                        <div className="d-flex flex-column mb-3">
                            {product.options.map((opt, index) => (
                                <div key={index} className="mb-3">
                                    <p className="">{opt.name}:</p>
                                    <span className=""></span>
                                    <div className="btn-group flex-wrap">
                                        {opt.values.map((val, j) => (
                                            <div className="form-check ps-2 mb-2" key={j}>
                                                <input
                                                    type="radio"
                                                    className="btn-check"
                                                    name={opt._id}
                                                    id={`option-${opt._id}-${val}`}
                                                    checked={option[opt.name] === val}
                                                    onChange={(e) => {
                                                        let data = {
                                                            ...option,
                                                        };
                                                        data[opt.name] = val;
                                                        if (Object.keys(data).length === product.options.length) {
                                                            let selected = product.children.find((child) => {
                                                                for (let key of Object.keys(data)) {
                                                                    if (data[key] !== child.option[key]) {
                                                                        return false;
                                                                    }
                                                                }
                                                                return true;
                                                            });
                                                            console.log(selected);
                                                            setChildSelected(selected);
                                                        } else {
                                                            setChildSelected(product.children[0]);
                                                        }
                                                        setOption(data);
                                                    }}
                                                />
                                                <label className="btn btn-outline-primary" htmlFor={`option-${opt._id}-${val}`}>
                                                    {val}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="d-flex flex-column pt-2 border-top mb-3">
                        <div className="">
                            <p className="">Số lượng</p>
                            <InputQuantity
                                id="quantity"
                                name="quantity"
                                value={quantity}
                                onChange={(value) => {
                                    if (value < 0) {
                                        setQuantity(0);
                                    } else if (product.countInStock && value > product.countInStock) {
                                        setQuantity(product.countInStock);
                                    } else {
                                        setQuantity(value);
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="d-flex">
                        <button className="btn btn-primary px-5 py-3" onClick={handleAddToCart}>
                            <i className="bi bi-cart-plus"></i> Chọn mua
                        </button>
                    </div>
                </div>
            </div>
            <div className="row mb-3">
                {productSuggest && productSuggest.length > 0 && (
                    <>
                        <h3 className="mb-3">Sản phẩm tương tự</h3>
                        <OwlCarousel>
                            {productSuggest.map((prod, index) => (
                                <ProductCard key={index} product={prod} className="me-2" />
                            ))}
                        </OwlCarousel>
                    </>
                )}
            </div>
            <div className="row mb-3 border-bottom">
                {product && product.description && (
                    <>
                        <h3 className="mb-3">Mô tả sản phẩm</h3>
                        <div
                            className="w-75 text-break"
                            dangerouslySetInnerHTML={{
                                __html: product.description,
                            }}
                        ></div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ProductDetailPage;
