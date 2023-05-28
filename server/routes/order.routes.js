const express = require("express");
const orderController = require("../controllers/order.controller");
const verifyToken = require("../middlewares/verifyToken.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

const router = express.Router();

router.post("/", verifyToken, orderController.create);
router.get("/listing", verifyToken, isAdmin, orderController.getList);
router.get("/mine", verifyToken, orderController.getMine);
router.get("/:id", verifyToken, orderController.getOne);
router.put("/:id/delivered", verifyToken, isAdmin, orderController.updateDelivered);
router.put("/:id/pay", verifyToken, orderController.updatePay);

module.exports = router;
