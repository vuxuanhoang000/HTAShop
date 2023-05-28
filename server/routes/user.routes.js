const express = require("express");
const userController = require("../controllers/user.controller");
const verifyToken = require("../middlewares/verifyToken.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

const router = express.Router();

router.get("/listing", verifyToken, isAdmin, userController.getList);
router.get("/:id", verifyToken, isAdmin, userController.getOne);
router.post("/", verifyToken, isAdmin, userController.create);
router.put("/:id", verifyToken, isAdmin, userController.update);
router.delete("/:id", verifyToken, isAdmin, userController.delete);

module.exports = router;
