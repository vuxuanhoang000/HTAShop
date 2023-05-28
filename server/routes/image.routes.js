const express = require("express");
const verifyToken = require("../middlewares/verifyToken.middleware");
const imageService = require("../services/image.service");
const isAdmin = require("../middlewares/isAdmin.middleware");
const imageModel = require("../models/image.model");
const router = express.Router();

router.post("/", verifyToken, async (req, res, next) => {
    try {
        const { content } = req.body;
        const path = await imageService.create(content);
        res.status(201).send({ path: path });
    } catch (error) {
        next(error);
    }
});
router.delete("/:id", verifyToken, isAdmin, async (req, res, next) => {
    try {
        const { id } = req.params;
        const image = await imageModel.findOne({ _id: id });
        if (!image) {
            return res.status(404).send({
                message:
                    "Xóa không thành công. Hình ảnh không tồn tại hoặc đã bị xóa",
            });
        }
        const isDelete = await imageService.remove(image.name);
        if (isDelete) {
            return res.status(204).send({ message: "Xóa thành công" });
        } else {
            return res.status(500).send({
                message: "Xóa không thành công",
            });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
