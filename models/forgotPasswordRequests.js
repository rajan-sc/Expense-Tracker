const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { v4: uuidv4 } = require("uuid");

const forgotPasswordRequestSchema = new Schema({
    _id: {
        type: String,
        default: uuidv4,
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model("ForgotPasswordRequest", forgotPasswordRequestSchema);
