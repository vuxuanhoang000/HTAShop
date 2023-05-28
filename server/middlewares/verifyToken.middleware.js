const { JWT_SECRET } = require("../config");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

async function verifyToken(req, res, next) {
    let token = req.headers["authorization"];
    // let token =
    //     "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NDRmNWEwMDZmOThlMGViYmJlMGIwNmIiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWF0IjoxNjgyOTIxOTg0LCJleHAiOjE2ODM1MjY3ODR9.zxJFhAd2RO2YMlmZZgyLGuXzgelQxlmmmY1ZIsKJBIc";

    if (!token) {
        return res.status(401).send({ message: "Token không được cung cấp." });
    }

    token = token.replace(/^Bearer\s+/, "");

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await userModel.findOne({
            _id: decoded.userId,
        });

        if (!user) {
            return res.status(401).send({ message: "Token không hợp lệ." });
        } else {
            req.userId = decoded.userId;
            req.email = decoded.email;
            next();
        }
    } catch (error) {
        console.log(error);
        return res.status(401).send({ message: "Từ chối truy cập" });
    }
}

module.exports = verifyToken;
