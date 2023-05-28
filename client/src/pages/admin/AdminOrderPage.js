import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLocation, useNavigate } from "react-router-dom";
import { alertError, formatCurrency } from "../../helpers";
import Pagination from "../../components/Pagination";
import axios from "axios";
import { getHeaders } from "../../utils";
import Modal from "../../components/Modal";
import UpdateOrderForm from "../../components/admin/order/UpdateOrderForm";

function AdminOrderPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname, search } = location;
    const urlSearchParams = new URLSearchParams(search);
    const s = urlSearchParams.get("s") || "";
    const page = Number(urlSearchParams.get("page")) || 1;
    const [searchString, setSearchString] = useState(s);
    const [totalPages, setTotalPages] = useState(0);
    const [titleModal, setTitleModal] = useState("");
    const [order, setOrder] = useState(null);

    const [orders, setOrders] = useState(null);
    const getOrders = async () => {
        try {
            const { data } = await axios.get(`/api/order/listing`, {
                headers: getHeaders(),
            });
            setOrders(data.data);
            setTotalPages(data.totalPages);
        } catch (error) {
            alertError(error);
        }
    };
    useEffect(() => {
        getOrders();
    }, []);
    return (
        <div className="card border-0 min-vh-100">
            <Helmet>
                <title>Quản lý đơn hàng</title>
            </Helmet>
            <div className="card-header d-flex justify-content-between">
                <h3 className="">Quản lý đơn hàng</h3>
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
                                <th>Tên</th>
                                <th>Email</th>
                                <th>Tổng giá</th>
                                <th>Thanh toán</th>
                                <th>Ngày đặt</th>
                                <th>Trạng thái</th>
                                <th colSpan={2}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders?.length > 0 &&
                                orders.map((order, index) => (
                                    <tr key={order._id}>
                                        <th>{index + 1}</th>
                                        <td>{order.user.profile.firstName + " " + order.user.profile.lastName}</td>
                                        <td>{order.user.email}</td>
                                        <td>{formatCurrency(order.totalPrice)}</td>
                                        <td>
                                            {order.isPaid ? (
                                                <span className="badge bg-success">{order.paidAt.substring(0, 10)}</span>
                                            ) : (
                                                <span className="badge bg-danger">Chưa trả tiền</span>
                                            )}
                                        </td>
                                        <td>{order.createdAt.substring(0, 10)}</td>
                                        <td>
                                            {order.isDelivered ? (
                                                <span className="badge bg-success">{order.deliveredAt.substring(0, 10)}</span>
                                            ) : (
                                                <span className="badge bg-dark">Chưa giao đến</span>
                                            )}
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-success"
                                                data-bs-toggle="modal"
                                                data-bs-target="#order"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    setOrder(order);
                                                    setTitleModal("Chỉnh sửa đơn hàng");
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
            <Modal id="order" title={titleModal}>
                <UpdateOrderForm actionAfterSubmit={getOrders} order={order} />
            </Modal>
        </div>
    );
}

export default AdminOrderPage;
