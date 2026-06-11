const { sendEmail } = require("../services/brevoService");
const User = require("../models/user");
const ForgotPasswordRequest = require("../models/forgotPasswordRequests");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const sendForgotPasswordEmail = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const forgotPasswordRequest = await ForgotPasswordRequest.create({ userId: user._id });
        await sendEmail(email, user.name, forgotPasswordRequest._id);
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const resetPassword = async (req, res) => {
    try {
        const uuid = req.params.uuid;
        const forgotPasswordRequest = await ForgotPasswordRequest.findOne({ _id: uuid });
        if (!forgotPasswordRequest) {
            return res.status(404).json({ message: "Invalid request" });
        }
        if (forgotPasswordRequest.isActive === false) {
            return res.status(400).json({ message: "Link has been used already" });
        }
        const user = await User.findOne({ _id: forgotPasswordRequest.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        user.password = hashedPassword;
        await user.save();
        
        forgotPasswordRequest.isActive = false;
        await forgotPasswordRequest.save();
        
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {
    sendForgotPasswordEmail,
    resetPassword
}
