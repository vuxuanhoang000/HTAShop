const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");

const { JWT_SECRET, JWT_EXPIRES_IN } = require("../config");
const imageService = require("../services/image.service");
const userService = require("../services/user.service");

class AuthController {
    async login(req, res, next) {
        try {
            let { email, password } = req.body;
            if (!email || !password) {
                return res
                    .status(400)
                    .send({ message: "Thiếu email hoặc mật khẩu" });
            }

            const user = await userModel.findOne({ email: email });

            if (!user) {
                return res
                    .status(400)
                    .send({ message: "Email hoặc mật khẩu không đúng" });
            }

            const verify = bcrypt.compareSync(password, user.password);

            if (!verify) {
                return res
                    .status(400)
                    .send({ message: "Email hoặc mật khẩu không đúng" });
            }

            const token = jwt.sign(
                { userId: user._id, email: user.email },
                JWT_SECRET,
                {
                    expiresIn: JWT_EXPIRES_IN || 36000,
                }
            );

            return res.status(200).send({
                token: token,
                expire_in: JWT_EXPIRES_IN,
                auth_type: "Bearer Token",
            });
        } catch (error) {
            next(error);
        }
    }
    async register(req, res, next) {
        try {
            const { email, password, firstName, lastName } = req.body;
            if (!email || !password || !firstName || !lastName) {
                return res.status(400).send({
                    message: `Thiếu giá trị ${!email ? "email, " : ""}${
                        !password ? "password, " : ""
                    }${!firstName ? "firstName, " : ""}${
                        !lastName ? "lastName, " : ""
                    }`,
                });
            }

            let user = await userModel.findOne({ email: email });
            if (user) {
                return res.status(400).send({ message: "Email đã tồn tại" });
            }

            user = new userModel({
                email: email,
                password: bcrypt.hashSync(password),
                role: "Customer",
                profile: {
                    firstName: firstName,
                    lastName: lastName,
                },
            });

            await user.save();

            const token = jwt.sign(
                { userId: user._id, email: user.email },
                JWT_SECRET,
                {
                    expiresIn: JWT_EXPIRES_IN || 36000,
                }
            );

            return res.status(200).send({
                message: "Đăng kí thành công",
                user: {
                    _id: user._id,
                    email: user.email,
                    role: user.role,
                    profile: user.profile,
                },
                token: token,
            });
        } catch (error) {
            next(error);
        }
    }
    async me(req, res, next) {
        try {
            const user = await userService.findOne({ email: req.email });

            return res.status(200).send(user);
        } catch (error) {
            next(error);
        }
    }

    async updateMe(req, res, next) {
        try {
            const { password, firstName, lastName, avatar } = req.body;
            if (!password) {
                return res.status(403).send({
                    message: "Thiếu password hoặc password không đúng",
                });
            }
            if (!firstName || !lastName) {
                return res.status(400).send({
                    message: `Thiếu giá trị ${!firstName ? "firstName, " : ""}${
                        !lastName ? "lastName, " : ""
                    }`,
                });
            }
            const user = await userModel.findOne({ email: req.email });
            if (!bcrypt.compareSync(password, user.password)) {
                return res.status(400).send({ message: "Mật khẩu không đúng" });
            }
            user.profile.firstName = firstName;
            user.profile.lastName = lastName;
            await user.save();
            if (avatar) {
                const image = await imageService.create(avatar, {
                    userId: req.userId,
                });
                user.profile.avatar = image;
            }
            user.password = undefined;
            return res.status(200).send(user);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AuthController();
