const authRouter = require("./auth.routes");
const brandRouter = require("./brand.routes");
const categoryRouter = require("./category.routes");
const carouselRouter = require("./carousel.routes");
const productRouter = require("./product.routes");
const imageRouter = require("./image.routes");
const orderRouter = require("./order.routes");
const userRouter = require("./user.routes");
const statisticsRouter = require("./statistics.routes");
const seedRouter = require("./seed.routes");
function route(app) {
    app.use("/api/auth", authRouter);
    app.use("/api/brand", brandRouter);
    app.use("/api/category", categoryRouter);
    app.use("/api/carousel", carouselRouter);
    app.use("/api/product", productRouter);
    app.use("/api/image", imageRouter);
    app.use("/api/order", orderRouter);
    app.use("/api/user", userRouter);
    app.use("/api/statistics", statisticsRouter);
    app.use("/api/seed", seedRouter);
}

module.exports = route;
