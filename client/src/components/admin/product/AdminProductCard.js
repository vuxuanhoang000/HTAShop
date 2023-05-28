import React from "react";
import { Link } from "react-router-dom";
import { alertError, formatCurrency } from "../../../helpers";
import axios from "axios";
import { getHeaders } from "../../../utils";

function AdminProductCard(props) {
    const { product, onDelete } = props;
    const {
        _id,
        name,
        slug,
        rating,
        countOfReviews,
        countOfSold,
        price,
        discount,
        countInStock,
        thumbnailImage,
    } = product;
    return (
        <div className="card mb-3">
            <Link to={`/product/${slug}`} target="blank">
                <img
                    src={thumbnailImage}
                    alt={name}
                    className="card-img-top"
                    style={{ height: "18rem" }}
                />
            </Link>

            <div className="card-body p-2">
                <Link
                    to={`/product/${slug}`}
                    target="blank"
                    className="card-title text-truncate-2 text-body text-decoration-none"
                >
                    {name}
                </Link>
                <div className="d-flex gap-2 mb-2">
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
            <div className="card-footer bg-transparent">
                <div
                    className="d-grid gap-2 text-center"
                    style={{ gridTemplateColumns: "auto auto" }}
                >
                    <Link
                        to={`/admin/product/${_id}/edit`}
                        className="btn btn-outline-success"
                    >
                        <i className="bi bi-pencil-square"></i>
                    </Link>
                    <button
                        className="btn btn-outline-danger"
                        onClick={async (e) => {
                            e.preventDefault();
                            try {
                                if (
                                    window.confirm(
                                        `Bạn chắc chắn muốn xóa sản phẩm "${name}" không ?`
                                    )
                                ) {
                                    await axios.delete(`/api/product/${_id}`, {
                                        headers: getHeaders(),
                                    });
                                    if (onDelete) onDelete();
                                }
                            } catch (error) {
                                alertError(error);
                            }
                        }}
                    >
                        <i className="bi bi-trash"></i>
                    </button>
                </div>
            </div>
            <small
                className="position-absolute"
                style={{ top: "6px", left: "4px" }}
            >
                {countInStock > 0 ? (
                    <span className="rounded bagde px-2 py-1 text-bg-success">
                        Còn hàng
                    </span>
                ) : (
                    <span className="rounded bagde px-2 py-1 text-bg-danger">
                        Hết hàng
                    </span>
                )}
            </small>
        </div>
    );
}

export default AdminProductCard;
