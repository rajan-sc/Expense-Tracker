const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: "INR"
    },
    status: {
        type: String,
        default: "PENDING"
    },
    paymentSessionId: {
        type: String,
        required: false
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

module.exports = mongoose.model("Order", orderSchema);
