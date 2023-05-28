const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        productId: {
            type: mongoose.Types.ObjectId,
            ref: "products",
        },
        categoryId: {
            type: mongoose.Types.ObjectId,
            ref: "categories",
        },
        brandId: {
            type: mongoose.Types.ObjectId,
            ref: "brands",
        },
        userId: {
            type: mongoose.Types.ObjectId,
            ref: "users",
        },
        carouselId: {
            type: mongoose.Types.ObjectId,
            ref: "carousels",
        },

        sortOrder: {
            type: Number,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("images", ImageSchema);
