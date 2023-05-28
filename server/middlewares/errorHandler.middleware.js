function errorHandler(error, req, res, next) {
    console.error(error);
    return res.status(500).send({ message: "Lỗi Server" });
}

module.exports = errorHandler;
