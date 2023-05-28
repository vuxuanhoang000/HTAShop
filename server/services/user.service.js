const userModel = require("../models/user.model");

class UserService {
    async find(query, page, limit, sort = { createdAt: -1 }) {}

    async findOne(query) {
        const user = await userModel.aggregate([
            {
                $match: query,
            },
            {
                $lookup: {
                    from: "images",
                    localField: "_id",
                    foreignField: "userId",
                    as: "profile.avatar",
                },
            },
            {
                $unwind: {
                    path: "$profile.avatar",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $limit: 1,
            },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    role: 1,
                    "profile.firstName": 1,
                    "profile.lastName": 1,
                    "profile.avatar": {
                        $cond: {
                            if: { $eq: ["$profile.avatar", null] },
                            then: null,
                            else: "$profile.avatar.name",
                        },
                    },
                },
            },
        ]);
        return user ? user[0] : null;
    }
}

module.exports = new UserService();
