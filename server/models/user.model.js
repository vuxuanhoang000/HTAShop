const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["Customer", "Admin"],
            required: true,
        },
        profile: {
            firstName: String,
            lastName: String,
            gender: String,
            birth: Date,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("users", UserSchema);
