import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatCurrency } from "../helpers";
import axios from "axios";
import { getHeaders } from "../utils";
import { CART_ADD_ITEM, CART_REMOVE_ITEM, ShopContext } from "../context/ShopContext";
import { Helmet } from "react-helmet-async";
import InputQuantity from "../components/InputQuantity";

function CartPage() {
    const { state, dispatch } = useContext(ShopContext);
    const {
        cart: { cartItems },
    } = state;
    const [items, setItems] = useState([]);
    useEffect(() => {
        const getItem = async (id) => {
            const { data } = await axios.get(`/api/product/child/${id}`, {
                headers: getHeaders(),
            });
            return data;
        };
        const getCartItems = async () => {
            let data = await Promise.all(
                cartItems.map(async (item) => {
                    let _item = await getItem(item._id);
                    return { ..._item, quantity: item.quantity };
                })
            );
            console.log(data);
            setItems(data);
        };
        getCartItems();
    }, [cartItems]);
    const handleUpdateCart = async (item, quantity) => {
        const { data } = await axios.get(`/api/product/child/${item._id}`, {
            headers: getHeaders(),
        });
        if (data?.countInStock < quantity) {
            window.alert("Rất tiếc, Sản phẩm đã hết hàng!");
            return;
        }
        if (quantity > 0) {
            dispatch({
                type: CART_ADD_ITEM,
                payload: { ...item, quantity },
            });
        }
    };

    const handleRemoveItem = (item) => {
        dispatch({
            type: CART_REMOVE_ITEM,
            payload: item,
        });
    };

    return (
        <div className="container">
            <Helmet>
                <title>Giỏ hàng - HTA Shop</title>
            </Helmet>
            <div className="row">
                <div className="col-lg-8 col-md-9">
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th style={{ width: "50px" }}>#</th>
                                <th className="w-auto">Sản phẩm</th>
                                <th style={{ width: "100px" }}>Đơn giá</th>
                                <th style={{ width: "100px" }}>Số lượng</th>
                                <th style={{ width: "100px" }}>Số tiền</th>
                                <th style={{ width: "100px" }}>Xóa</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => {
                                return (
                                    <tr key={index}>
                                        <th>{index + 1}</th>
                                        <td className="d-flex gap-2">
                                            <Link to={`/product/${item.slug}`} className="d-flex gap-1">
                                                <img
                                                    style={{
                                                        height: "150px",
                                                        width: "auto",
                                                    }}
                                                    src={item.thumbnailImage}
                                                    alt={item.name}
                                                />
                                            </Link>
                                            <div className="d-flex flex-column">
                                                <Link to={`/product/${item.slug}`} className="text-truncate-2">
                                                    {item.name}
                                                </Link>
                                                {item.option && (
                                                    <div className="">
                                                        {Object.keys(item.option).map((key) => (
                                                            <div key={key} className="">
                                                                {key}: {item.option[key]}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="text-center align-middle">
                                            <div className="d-flex flex-column align-items-center">
                                                <div className="text-danger fw-bold me-2">{formatCurrency(item.price - item.discount)}</div>
                                                {item.discount > 0 && <div className="fw-lighter text-decoration-line-through">{formatCurrency(item.price)}</div>}
                                            </div>
                                        </td>
                                        <td className="text-center align-middle">
                                            <InputQuantity
                                                value={item.quantity}
                                                onChange={(value) => {
                                                    handleUpdateCart(item, value);
                                                }}
                                            ></InputQuantity>
                                        </td>
                                        <td className="text-center align-middle text-danger fw-bold">{formatCurrency((item.price - item.discount) * item.quantity)}</td>
                                        <td className="text-center align-middle">
                                            <button
                                                className="btn btn-danger"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleRemoveItem(item);
                                                }}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="col-lg-4 col-md-3">
                    <div className="border rounded-0">
                        <h2 className="p-3 mb-3 border-bottom">Đơn hàng</h2>
                        <div className="d-flex justify-content-between px-3 mb-3">
                            <h6 className="">Số lượng sản phẩm</h6>
                            <h6 className="">{items.reduce((a, c) => a + c.quantity, 0)}</h6>
                        </div>
                        <div className="d-flex justify-content-between px-3 mb-3 border-bottom">
                            <h6 className="">Tổng thanh toán</h6>
                            <h6 className="text-danger fw-bold">{formatCurrency(items.reduce((a, c) => a + (c.price - c.discount) * c.quantity, 0))}</h6>
                        </div>
                        <div className="px-3 mb-3">
                            <Link to="/checkout" className="btn btn-primary w-100">
                                Mua hàng
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;
