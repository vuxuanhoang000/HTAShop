import React from "react";
import axios from "axios";
import { alertError } from "../../../helpers";
import { getHeaders } from "../../../utils";

function UpdateOrderForm(props) {
    const { actionAfterSubmit, order } = props;
    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();
                try {
                    if (order?._id) {
                        const { data } = await axios.put(`/api/order/${order._id}/delivered`, {}, { headers: getHeaders() });
                        window.alert(`Đơn hàng ${order._id} đã được cập nhật ngày giao cho khách.`);
                        if (actionAfterSubmit) {
                            actionAfterSubmit();
                        }
                    }
                } catch (error) {
                    alertError(error);
                }
            }}
        >
            <div className="mb-3">Xác nhận đơn hàng đã giao đến cho người mua.</div>
            <button type="submit" className="btn btn-success mb-4" data-bs-dismiss="modal">
                Xác nhận
            </button>
        </form>
    );
}

export default UpdateOrderForm;
