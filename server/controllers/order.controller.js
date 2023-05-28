const orderModal = require("../models/order.model");
const orderService = require("../services/order.service");

class OrderController {
    async create(req, res, next) {
        try {
            const { orderItems, shippingAddress, paymentMethod, itemsPrice, shippingPrice, taxPrice, totalPrice } = req.body;
            const newOrder = new orderModal({
                orderItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
                userId: req.userId,
            });
            const order = await newOrder.save();
            res.status(201).send(order);
        } catch (error) {
            next(error);
        }
    }
    async getList(req, res, next) {
        try {
            let { page = 1, limit = 24, s = "" } = req.query;

            page = Number(page) || 1;
            limit = Number(limit) || 24;

            const orders = await orderService.find({}, page, limit);
            const total = await orderModal.countDocuments({});
            const totalPages = Math.ceil(total / limit);
            return res.status(200).send({
                page: page,
                limit: limit,
                total: total,
                totalPages: totalPages,
                data: orders,
            });
        } catch (error) {
            next(error);
        }
    }
    async getMine(req, res, next) {
        try {
            const orders = await orderModal.find({ userId: req.userId });
            return res.send(orders);
        } catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const order = await orderModal.findById(id);
            if (order) {
                return res.send(order);
            } else {
                return res.staus(404).send({ message: "Không tìm thấy đơn hàng" });
            }
        } catch (error) {
            next(error);
        }
    }
    async updateDelivered(req, res, next) {
        try {
            const { id: orderId } = req.params;
            const order = await orderModal.findById(orderId);
            if (order) {
                order.isDelivered = true;
                order.deliveredAt = Date.now();
                if (!order.isPaid) {
                    order.isPaid = true;
                    order.paidAt = Date.now();
                }
                const updatedOrder = await order.save();
                return res.send(updatedOrder);
            } else {
                return res.status(404).send({ message: "Không tìm thấy đơn hàng" });
            }
        } catch (error) {
            next(error);
        }
    }
    async updatePay(req, res, next) {
        try {
            const { id: orderId } = req.params;
            const { id, status, updateTime, emailAddress } = req.body;
            const order = await orderModal.findById(orderId);
            if (order) {
                order.isPaid = true;
                order.paidAt = Date.now();
                order.paymentResult = {
                    id,
                    status,
                    updateTime,
                    emailAddress,
                };

                const updatedOrder = await order.save();
                return res.send(updatedOrder);
            } else {
                return res.status(404).send({ message: "Không tìm thấy đơn hàng" });
            }
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new OrderController();
