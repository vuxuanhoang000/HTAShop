import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { alertError, formatCurrency } from "../../helpers";
import axios from "axios";
import { getHeaders } from "../../utils";
import { Link } from "react-router-dom";

function AdminDashboardPage() {
    const [totalProdcuts, setTotalProducts] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalCustomers, setTotalCustomers] = useState(0);

    useEffect(() => {
        const getTotalProducts = async () => {
            try {
                const { data } = await axios.get("/api/statistics/total-products", {
                    headers: getHeaders(),
                });
                setTotalProducts(data.total);
            } catch (error) {
                alertError(error);
            }
        };
        const getTotalSales = async () => {
            try {
                const { data } = await axios.get("/api/statistics/total-sales", {
                    headers: getHeaders(),
                });
                setTotalSales(data.total);
            } catch (error) {
                alertError(error);
            }
        };
        const getTotalOrders = async () => {
            try {
                const { data } = await axios.get("/api/statistics/total-orders", {
                    headers: getHeaders(),
                });
                setTotalOrders(data.total);
            } catch (error) {
                alertError(error);
            }
        };
        const getTotalCustomer = async () => {
            try {
                const { data } = await axios.get("/api/statistics/total-customers", {
                    headers: getHeaders(),
                });
                setTotalCustomers(data.total);
            } catch (error) {
                alertError(error);
            }
        };
        getTotalProducts();
        getTotalSales();
        getTotalOrders();
        getTotalCustomer();
    }, []);
    return (
        <div className="card border-0 min-vh-100">
            <Helmet>
                <title>Trang chủ</title>
            </Helmet>
            <div className="card-header d-flex justify-content-between">
                <h3>Bảng điều khiển</h3>
            </div>
            <div className="card-body">
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-md-3">
                            <Link
                                to="/admin/products"
                                className="p-3 bg-secondary text-white text-decoration-none shadow-sm d-flex justify-content-around align-items-center rounded"
                            >
                                <div className="">
                                    <h3 className="fs-2">{totalProdcuts}</h3>
                                    <p className="fs-5">Sản phẩm</p>
                                </div>
                                <i className="bi bi-cart-plus p-3 fs-1"></i>
                            </Link>
                        </div>
                        <div className="col-md-3">
                            <Link
                                to="/admin/orders"
                                className="p-3 bg-secondary text-white text-decoration-none shadow-sm d-flex justify-content-around align-items-center rounded"
                            >
                                <div className="">
                                    <h3 className="fs-2">{totalOrders}</h3>
                                    <p className="fs-5">Đơn hàng</p>
                                </div>
                                <i className="bi bi-cart-plus p-3 fs-1"></i>
                            </Link>
                        </div>
                        <div className="col-md-3">
                            <Link
                                to="/admin/orders"
                                className="p-3 bg-secondary text-white text-decoration-none shadow-sm d-flex justify-content-around align-items-center rounded"
                            >
                                <div className="">
                                    <h3 className="fs-2">{formatCurrency(totalSales)}</h3>
                                    <p className="fs-5">Doanh thu</p>
                                </div>
                                <i className="bi bi-cart-plus p-3 fs-1"></i>
                            </Link>
                        </div>
                        <div className="col-md-3">
                            <Link to="/admin/users" className="p-3 bg-secondary text-white text-decoration-none shadow-sm d-flex justify-content-around align-items-center rounded">
                                <div className="">
                                    <h3 className="fs-2">{totalCustomers}</h3>
                                    <p className="fs-5">Người dùng</p>
                                </div>
                                <i className="bi bi-cart-plus p-3 fs-1"></i>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboardPage;
