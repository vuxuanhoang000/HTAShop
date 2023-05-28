const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CarouselSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("carousels", CarouselSchema);
