const productModel = require("../models/product.model");
const orderModel = require("../models/order.model");
const userModel = require("../models/user.model");

class StatisticsController {
    async getTotalProducts(req, res, next) {
        try {
            const total = await productModel.countDocuments({});
            return res.status(200).send({ total });
        } catch (error) {
            next(error);
        }
    }
    async getTotalSales(req, res, next) {
        try {
            let total = await orderModel.aggregate([
                {
                    $match: { isPaid: true },
                },
                {
                    $group: {
                        _id: null,
                        totalPrice: { $sum: "$itemsPrice" },
                    },
                },
            ]);
            total = total.length > 0 ? total[0].totalPrice : 0;
            return res.status(200).send({ total });
        } catch (error) {
            next(error);
        }
    }
    async getTotalOrders(req, res, next) {
        try {
            const total = await orderModel.countDocuments({});
            return res.status(200).send({ total });
        } catch (error) {
            next(error);
        }
    }
    async getTotalCustomers(req, res, next) {
        try {
            const total = await userModel.countDocuments({});
            return res.status(200).send({ total });
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new StatisticsController();
