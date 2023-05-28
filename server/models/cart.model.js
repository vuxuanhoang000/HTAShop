const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CartSchema = new Schema({
    productChildId: {
        type: mongoose.Types.ObjectId,
        ref: "product_childrens",
    },
    quantity: {
        type: Number,
        required: true,
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: "users",
    },
});

module.exports = mongoose.model("carts", CartSchema);
