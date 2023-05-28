const express = require("express");
const categoryController = require("../controllers/category.controller");
const verifyToken = require("../middlewares/verifyToken.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

const router = express.Router();

router.get("/listing", categoryController.getList);
router.get("/tree", categoryController.getTree);
router.get("/:id", categoryController.getOne);
router.get("/:id/children", categoryController.getOneWithChildren);
router.get("/:id/parent", categoryController.getOneWithParent);
router.get("/:id/products", categoryController.getProducts);

router.post("/", verifyToken, isAdmin, categoryController.create);
router.put("/:id", verifyToken, isAdmin, categoryController.update);
router.delete("/:id", verifyToken, isAdmin, categoryController.remove);

module.exports = router;
