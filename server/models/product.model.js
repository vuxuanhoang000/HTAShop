const mongoose = require("mongoose");
const { slugify } = require("../utils");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        description: {
            type: String,
            required: true,
        },
        price: {
            type: Number,
            default: 0,
        },
        discount: {
            type: Number,
            default: 0,
        },
        countInStock: {
            type: Number,
            default: 0,
        },
        rating: {
            type: Number,
            default: 0,
        },
        countOfReviews: {
            type: Number,
            default: 0,
        },
        countOfSold: {
            type: Number,
            default: 0,
        },
        options: [
            {
                code: String,
                name: String,
                values: [String],
            },
        ],
        categoryId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "categories",
        },
        brandId: {
            type: mongoose.Types.ObjectId,
            ref: "brands",
        },
        sellerId: {
            type: mongoose.Types.ObjectId,
            ref: "users",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("products", ProductSchema);
