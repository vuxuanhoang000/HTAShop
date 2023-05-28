const orderModel = require("../models/order.model");
class OrderService {
    async find(query, page = 1, limit = 24) {
        const orders = await orderModel.aggregate([
            {
                $match: query,
            },
            {
                $sort: { createdAt: -1 },
            },
            {
                $skip: (page - 1) * limit,
            },
            {
                $limit: limit,
            },
            {
                $lookup: {
                    from: "users",
                    localField: "userId",
                    foreignField: "_id",
                    as: "user",
                },
            },
            {
                $unwind: {
                    path: "$user",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $project: {
                    "user.password": 0,
                },
            },
        ]);
        return orders;
    }
}
module.exports = new OrderService();
