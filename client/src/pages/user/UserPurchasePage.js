import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import axios from "axios";
import { getHeaders } from "../../utils";
import { alertError, formatCurrency } from "../../helpers";
import { Link } from "react-router-dom";

function UserPurchasePage() {
    const [orders, setOrders] = useState(null);
    useEffect(() => {
        const getOrders = async () => {
            try {
                const { data } = await axios.get(`/api/order/mine`, { headers: getHeaders() });
                setOrders(data);
            } catch (error) {
                alertError(error);
            }
        };
        getOrders();
    }, []);
    return (
        <div className="d-flex flex-column pt-2">
            <Helmet>
                <title>Đơn mua của tôi</title>
            </Helmet>
            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Ngày mua</th>
                        <th>Tổng số tiền</th>
                        <th>Trả tiền</th>
                        <th>Giao hàng</th>
                        <th>Hàng động</th>
                    </tr>
                </thead>
                <tbody>
                    {orders?.map((order, index) => (
                        <tr key={order._id}>
                            <th>{index + 1}</th>
                            <td>{order.createdAt.substring(0, 10)}</td>
                            <td className="fw-bold">{formatCurrency(order.totalPrice)}</td>
                            <td>
                                {order.isPaid ? <span className="badge bg-success">{order.paidAt.substring(0, 10)}</span> : <span className="badge bg-danger">Chưa trả tiền</span>}
                            </td>
                            <td>
                                {order.isDelivered ? (
                                    <span className="badge bg-success">{order.deliveredAt.substring(0, 10)}</span>
                                ) : (
                                    <span className="badge bg-dark">Chưa giao đến</span>
                                )}
                            </td>
                            <td>
                                <Link to={`/order/${order._id}`}>Chi tiết</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserPurchasePage;
