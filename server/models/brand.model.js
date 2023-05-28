const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const BrandSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            unique: true,
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("brands", BrandSchema);
