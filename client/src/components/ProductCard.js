import React from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../helpers";

function ProductCard(props) {
    const { product, className } = props;
    const {
        // _id,
        name,
        slug,
        rating,
        countOfReviews,
        price,
        discount,
        // countInStock,
        countOfSold,
        thumbnailImage,
    } = product;
    return (
        <div className={`card mb-3 ${className}`}>
            <Link to={`/product/${slug}`}>
                <img
                    src={thumbnailImage}
                    alt=""
                    className="card-img-top"
                    style={{ height: "18rem" }}
                />
            </Link>

            <div className="card-body p-2">
                <Link
                    to={`/product/${slug}`}
                    className="card-title text-truncate-2 text-body text-decoration-none"
                >
                    {name}
                </Link>
                <div className="d-flex mb-2">
                    <h6 className="card-subtitle text-muted pe-2 w-50">
                        {[...Array(5)].map((v, i) => (
                            <i
                                key={i}
                                className={
                                    rating >= i + 1
                                        ? "bi bi-star-fill text-warning"
                                        : rating >= i + 0.5
                                        ? "bi bi-star-half text-warning"
                                        : "bi bi-star text-warning"
                                }
                            ></i>
                        ))}
                    </h6>
                    <p
                        className="fw-lighter text-truncate w-50"
                        style={{ fontSize: "0.7rem" }}
                    >
                        {countOfReviews > 0
                            ? `${countOfReviews} đánh giá`
                            : "chưa có đánh giá"}
                    </p>
                </div>

                <div className="d-flex gap-2 mb-3">
                    {discount > 0 ? (
                        <>
                            <p className="card-text text-danger fw-bold mb-0">
                                {formatCurrency(price - discount)}
                            </p>
                            <small className="card-text text-muted text-decoration-line-through">
                                {formatCurrency(price)}
                            </small>
                        </>
                    ) : (
                        <>
                            <p className="card-text text-danger fw-bold mb-0">
                                {formatCurrency(price)}
                            </p>
                        </>
                    )}
                </div>
            </div>
            <div className="card-footer bg-transparent d-flex align-items-center justify-content-end">
                <small>Đã bán {countOfSold}</small>
            </div>
            {discount > 0 && (
                <small
                    className="position-absolute rounded bagde text-bg-danger px-2"
                    style={{ top: "4px", left: "4px" }}
                >
                    - {Math.ceil((discount / price) * 100)}%
                </small>
            )}
        </div>
    );
}

export default ProductCard;
