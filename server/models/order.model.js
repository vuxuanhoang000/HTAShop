const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
    {
        orderItems: [
            {
                slug: { type: String, required: true },
                name: { type: String, required: true },
                option: { type: Object },
                quantity: { type: Number, required: true },
                thumbnailImage: { type: String, required: true },
                price: { type: Number, required: true },
                discount: { type: Number, required: true },
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "products",
                    required: true,
                },
            },
        ],
        shippingAddress: {
            fullName: { type: String, required: true },
            address: { type: String, required: true },
            phoneNumber: { type: String, require: true },
        },
        paymentMethod: { type: String, required: true },
        paymentResult: {
            id: String,
            status: String,
            updateTime: String,
            emailAddress: String,
        },
        itemsPrice: { type: Number, required: true },
        shippingPrice: { type: Number, required: true },
        taxPrice: { type: Number, required: true },
        totalPrice: { type: Number, required: true },
        userId: { type: mongoose.Schema.ObjectId, ref: "users", required: true },
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        isDelivered: { type: Boolean, default: false },
        deliveredAt: { type: Date },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("orders", OrderSchema);
