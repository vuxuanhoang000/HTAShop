const userModel = require("../models/user.model");

async function isAdmin(req, res, next) {
    try {
        const user = await userModel.findOne({ _id: req.userId });
        if (user.role !== "Admin") {
            return res.status(403).send({ message: "Không có quyền truy cập" });
        } else {
            next();
        }
    } catch (error) {
        return res.status(500).send({ message: "Lỗi Server" });
    }
}

module.exports = isAdmin;
