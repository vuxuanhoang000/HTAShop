import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import { getHeaders } from "../utils";
import axios from "axios";
import { alertError, formatCurrency } from "../helpers";
import { CART_CLEAR, ShopContext } from "../context/ShopContext";
import { SAVE_SHIPPING_ADDRESS } from "../context/ShopContext";
import { SAVE_PAYMENT_METHOD } from "../context/ShopContext";

function CheckoutPage() {
    const navigate = useNavigate();
    const [userInfo, setUserInfo] = useState({});
    const { state, dispatch } = useContext(ShopContext);

    const {
        cart: { cartItems, shippingAddress, paymentMethod },
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
    useEffect(() => {
        const getUser = async () => {
            try {
                const { data } = await axios.get("/api/auth/me", {
                    headers: getHeaders(),
                });
                setUserInfo(data);
            } catch (error) {
                alertError(error, () => navigate("/login?redirect=/checkout"));
            }
        };
        getUser();
    }, [navigate]);
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        let itemsPrice = items.reduce((a, c) => a + (c.price - c.discount) * c.quantity, 0);
        let shippingPrice = 0;
        let taxPrice = 0;
        let totalPrice = itemsPrice + shippingPrice + taxPrice;
        try {
            const { data } = await axios.post(
                `/api/order`,
                {
                    orderItems: items,
                    shippingAddress: shippingAddress,
                    paymentMethod: paymentMethod,
                    itemsPrice: itemsPrice,
                    shippingPrice: shippingPrice,
                    taxPrice: taxPrice,
                    totalPrice: totalPrice,
                },
                {
                    headers: getHeaders(),
                }
            );
            dispatch({ type: CART_CLEAR });
            navigate(`/order/${data._id}`);
        } catch (error) {
            alertError(error);
        }
    };
    return userInfo.email ? (
        <div className="container">
            <Helmet>
                <title>Thanh toán - HTA Shop</title>
            </Helmet>
            <div className="row">
                <div className="col-lg-8">
                    <div className="mb-4">
                        <h4 className="mb-3">Địa chỉ thanh toán</h4>
                        <div className="mb-3">
                            <label htmlFor="fullName" className="form-label">
                                Họ tên người nhận
                            </label>
                            <input
                                type="text"
                                name="fullName"
                                id="fullName"
                                required
                                placeholder="Nguyễn Văn A"
                                className="form-control"
                                value={shippingAddress.fullName}
                                onChange={(e) => dispatch({ type: SAVE_SHIPPING_ADDRESS, payload: { fullName: e.target.value } })}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="address" className="form-label">
                                Địa chỉ nhận hàng
                            </label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                placeholder="Đường ..., thôn ..., xã ..., huyện (quận) ..., tỉnh (thành phố) ..."
                                className="form-control"
                                required
                                value={shippingAddress.address}
                                onChange={(e) => dispatch({ type: SAVE_SHIPPING_ADDRESS, payload: { address: e.target.value } })}
                            />
                        </div>
                        <div className="mb-5">
                            <label htmlFor="phoneNumber" className="form-label">
                                Số điện thoại liện hệ
                            </label>
                            <input
                                type="text"
                                name="phoneNumber"
                                id="phoneNumber"
                                required
                                placeholder="098........."
                                className="form-control"
                                value={shippingAddress.phoneNumber}
                                onChange={(e) => dispatch({ type: SAVE_SHIPPING_ADDRESS, payload: { phoneNumber: e.target.value } })}
                            />
                        </div>
                        <div className="card border-secondary mb-5">
                            <div className="card-header bg-light">
                                <h4 className="">Tổng số đơn hàng</h4>
                            </div>
                            <div className="card-body">
                                <h5 className="">Sản phẩm</h5>
                                {items?.length > 0 &&
                                    items.map((item, index) => (
                                        <div key={index} className="d-flex justify-content-between gap-5">
                                            <p className="">{item.name}</p>
                                            <p className="text-danger fw-bold">{formatCurrency((item.price - item.discount) * item.quantity)}</p>
                                        </div>
                                    ))}
                                <hr className="mt-0" />
                                <div className="d-flex justify-content-between">
                                    <h5 className="">Tổng</h5>
                                    <p className="text-danger fw-bold">{formatCurrency(items.reduce((a, c) => a + (c.price - c.discount) * c.quantity, 0))}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-4">
                    <div className="card border-secondary mb-5">
                        <div className="card-header bg-light">
                            <h4 className="">Phương thức thanh toán</h4>
                        </div>
                        <div className="card-body">
                            <div className="form-check">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    id="payOnDelivery"
                                    className="form-check-input"
                                    checked={paymentMethod === "payOnDelivery"}
                                    onChange={(e) => dispatch({ type: SAVE_PAYMENT_METHOD, payload: "payOnDelivery" })}
                                />
                                <label htmlFor="payOnDelivery" className="form-check-label">
                                    Thanh toán khi nhận hàng
                                </label>
                            </div>
                            {/* <div className="form-check">
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    id="vnPay"
                                    className="form-check-input"
                                    checked={paymentMethod === "vnPay"}
                                    onChange={(e) => dispatch({ type: SAVE_PAYMENT_METHOD, payload: "vnPay" })}
                                />
                                <label htmlFor="vnPay" className="form-check-label">
                                    VNPay
                                </label>
                            </div> */}
                        </div>
                        <div className="card-footer border-secondary bg-transparent">
                            <button className="btn btn-primary my-3 py-3 w-100 h-100" onClick={handlePlaceOrder}>
                                Mua hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div></div>
    );
}

export default CheckoutPage;
