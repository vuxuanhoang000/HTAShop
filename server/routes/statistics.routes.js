const express = require("express");
const statisticsController = require("../controllers/statistics.controller");
const verifyToken = require("../middlewares/verifyToken.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

const router = express.Router();

router.get("/total-products", verifyToken, isAdmin, statisticsController.getTotalProducts);
router.get("/total-sales", verifyToken, isAdmin, statisticsController.getTotalSales);
router.get("/total-orders", verifyToken, isAdmin, statisticsController.getTotalOrders);
router.get("/total-customers", verifyToken, isAdmin, statisticsController.getTotalCustomers);

module.exports = router;
