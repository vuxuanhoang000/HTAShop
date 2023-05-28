const { PORT, DB_URI, DB_NAME } = require("./config");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const route = require("./routes");
const errorHandler = require("./middlewares/errorHandler.middleware");

mongoose
    .connect(DB_URI, {
        dbName: DB_NAME,
        autoCreate: true,
        autoIndex: true,
        connectTimeoutMS: 30000,
    })
    .then(() => {
        console.log("connected to mongodb");
    })
    .catch((error) => {
        console.log(error.message);
    });

const app = express();
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: false }));
app.use("/", express.static(path.join(__dirname, "/public")));

route(app);

app.use(errorHandler);

const port = PORT || 5000;
app.listen(port, () => {
    console.log(`server listen on port ${port}`);
});
