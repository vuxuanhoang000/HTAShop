const express = require("express");
const verifyToken = require("../middlewares/verifyToken.middleware");
const isAdmin = require("../middlewares/isAdmin.middleware");

const carouselController = require("../controllers/carousel.controller");

const router = express.Router();

router.get("/listing", carouselController.getList);
router.get("/:id", carouselController.getOne);

router.post("/", verifyToken, isAdmin, carouselController.create);
router.put("/:id", verifyToken, isAdmin, carouselController.update);
router.delete("/:id", verifyToken, isAdmin, carouselController.remove);

module.exports = router;
