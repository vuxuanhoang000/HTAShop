const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductChildSchema = new Schema(
    {
        option: Object,
        price: {
            type: Number,
            required: true,
        },
        discount: {
            type: Number,
            required: true,
        },
        countInStock: {
            type: Number,
            required: true,
        },
        productId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("product_children", ProductChildSchema);
