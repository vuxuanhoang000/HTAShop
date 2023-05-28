const userModel = require("../models/user.model");

class UserController {
    async getList(req, res, next) {
        try {
            let { page = 1, limit = 24, s = "" } = req.query;
            page = Number(page) || 1;
            limit = Number(limit) || 24;
            let query = {};
            if (s) {
                const regex = new RegExp(s, "gi");
                query["$or"] = [{ "profile.firstName": { $regex: regex } }, { "profile.lastName": { $regex: regex } }];
            }
            const users = await userModel
                .find(query, { password: 0 })
                .skip((page - 1) * limit)
                .limit(limit);
            const total = await userModel.countDocuments(query);
            const totalPages = Math.ceil(total / limit);
            return res.status(200).send({
                page: page,
                limit: limit,
                total: total,
                totalPages: totalPages,
                data: users,
            });
        } catch (error) {
            next(error);
        }
    }
    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const user = await userModel.findOne({ _id: id }, { password: 0 });
            if (user) {
                return res.send(user);
            } else {
                return res.status(404).send({ message: "Người dùng không tồn tại hoặc đã bị xóa." });
            }
        } catch (error) {
            next(error);
        }
    }
    async create(req, res, next) {
        try {
            res.status(500).send("Server error");
        } catch (error) {
            next(error);
        }
    }
    async update(req, res, next) {
        try {
            res.status(500).send("Server error");
        } catch (error) {
            next(error);
        }
    }
    async delete(req, res, next) {
        try {
            res.status(500).send("Server error");
        } catch (error) {
            next(error);
        }
    }
}
module.exports = new UserController();
