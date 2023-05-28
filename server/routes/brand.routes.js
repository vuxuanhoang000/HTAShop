const express = require("express");
const verifyToken = require("../middlewares/verifyToken.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

const brandController = require("../controllers/brand.controller");

const router = express.Router();

router.get("/listing", brandController.getList);
router.get("/:id", brandController.getOne);
router.get("/:id/products", brandController.getProducts);

router.post("/", verifyToken, isAdmin, brandController.create);
router.put("/:id", verifyToken, isAdmin, brandController.update);
router.delete("/:id", verifyToken, isAdmin, brandController.remove);

module.exports = router;
