const express = require("express");
const productController = require("../controllers/product.controller");
const verifyToken = require("../middlewares/verifyToken.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");
const router = express.Router();

router.get("/listing", productController.getList);
router.get("/:id", productController.getOne);
router.get("/child/:id", productController.getOneChild);
router.post("/", verifyToken, isAdmin, productController.create);
router.put("/:id", verifyToken, isAdmin, productController.update);
router.delete("/:id", verifyToken, isAdmin, productController.remove);

router.delete(
    "/:id/children/:childId",
    verifyToken,
    isAdmin,
    productController.removeChild
);

module.exports = router;
