const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
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
        parentId: {
            type: mongoose.Types.ObjectId,
            ref: "categories",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("categories", CategorySchema);
