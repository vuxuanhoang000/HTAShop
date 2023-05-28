import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { alertError, formatCurrency } from "../../helpers";
import axios from "axios";
import { getHeaders } from "../../utils";
import { Helmet } from "react-helmet-async";

function UserPurchaseDetailPage() {
    const { id } = useParams();
    const [order, setOrder] = useState({});
    useEffect(() => {
        const getOrder = async () => {
            try {
                const { data } = await axios.get(`/api/order/${id}`, {
                    headers: getHeaders(),
                });
                console.log(data);
                setOrder(data);
            } catch (error) {
                alertError(error);
            }
        };
        getOrder();
    }, [id]);
    return order?._id ? (
        <div className="container">
            <Helmet>
                <title>Đơn hàng {order._id}</title>
            </Helmet>
            <h1 className="">Đơn hàng {order._id}</h1>
            <div className="row">
                <div className="col-md-8">
                    <div className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Thông tin giao hàng</h5>
                            <div className="card-text mb-2">
                                <strong>Tên người nhận: </strong>
                                {order.shippingAddress.fullName}
                                <br />
                                <strong>Địa chỉ: </strong>
                                {order.shippingAddress.address}
                            </div>
                            {order.isDelivered ? (
                                <div className="alert alert-success" role="alert">
                                    Đã giao vào {order.deliveredAt.substring(0, 10)}
                                </div>
                            ) : (
                                <div className="alert alert-danger" role="alert">
                                    Chưa giao đến
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Hình thức thanh toán</h5>
                            <p className="card-text">
                                {order.paymentMethod === "payOnDelivery" ? "Thanh toán khi nhận hàng" : order.paymentMethod === "vnPay" ? "Thanh toán qua ví VNPay" : ""}
                            </p>
                            {order.isPaid ? (
                                <div className="alert alert-success" role="alert">
                                    Đã thanh toán vào {order.paidAt.substring(0, 10)}
                                </div>
                            ) : (
                                <div className="alert alert-danger" role="alert">
                                    Chưa thanh toán
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Sản phẩm</h5>
                            <ul className="list-group list-group-flush">
                                {order.orderItems.map((item) => (
                                    <li key={item._id} className="list-group-item">
                                        <div className="row align-items-center">
                                            <div className="col-md-6 d-flex gap-2 align-items-center">
                                                <img
                                                    style={{ height: "150px", width: "auto" }}
                                                    src={item.thumbnailImage}
                                                    alt={item.name}
                                                    className="img-fluid rounded img-thumbnail"
                                                />
                                                <Link to={`/product/${item.slug}`} className="text-truncate-2">
                                                    {item.name}
                                                </Link>
                                            </div>
                                            <div className="col-md-3">
                                                <span>{item.quantity}</span>
                                            </div>
                                            <div className="col-md-3 text-danger">${formatCurrency(item.price - item.discount)}</div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Đơn hàng</h5>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">
                                    <div className="row">
                                        <div className="col">Sản phẩm</div>
                                        <div className="col text-danger">{formatCurrency(order.itemsPrice)}</div>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="row">
                                        <div className="col">Vận chuyển</div>
                                        <div className="col text-danger">{formatCurrency(order.shippingPrice)}</div>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="row">
                                        <div className="col">Tax</div>
                                        <div className="col text-danger">{formatCurrency(order.taxPrice)}</div>
                                    </div>
                                </li>
                                <li className="list-group-item">
                                    <div className="row">
                                        <div className="col">
                                            <strong>Tổng</strong>
                                        </div>
                                        <div className="col">
                                            <strong className="text-danger">{formatCurrency(order.totalPrice)}</strong>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div></div>
    );
}

export default UserPurchaseDetailPage;
