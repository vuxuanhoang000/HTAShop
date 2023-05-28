const express = require("express");
const authController = require("../controllers/auth.controller");
const verifyToken = require("../middlewares/verifyToken.middleware");

const router = express.Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.get("/me", verifyToken, authController.me);
router.put("/me", verifyToken, authController.updateMe);

module.exports = router;
