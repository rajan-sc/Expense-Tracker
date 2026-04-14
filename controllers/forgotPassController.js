const { sendEmail } = require("../services/brevoService");
const { User } = require("../models/associations");
const { ForgotPasswordRequest } = require("../models/associations");
const bcrypt = require("bcrypt");
const sequelize = require("../utils/dbConnection");

const sendForgotPasswordEmail = async (req, res) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const forgotPasswordRequest = await ForgotPasswordRequest.create({ userId: user.id });
        await sendEmail(email, user.name, forgotPasswordRequest.id);
        res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


const resetPassword = async (req, res) => {
    let transxn;
    try {
        transxn = await sequelize.transaction();
        const uuid = req.params.uuid;
        const forgotPasswordRequest = await ForgotPasswordRequest.findOne({ where: { id: uuid } });
        if (!forgotPasswordRequest) {
            await transxn.rollback(); //rollback the transaction because earlier connection was hanged due to this
            return res.status(404).json({ message: "Invalid request" });
        }
        if (forgotPasswordRequest.isActive === false) {
            await transxn.rollback();
            return res.status(400).json({ message: "Link has been used already" });
        }
        const user = await User.findOne({ where: { id: forgotPasswordRequest.userId } });
        if (!user) {
            await transxn.rollback();
            return res.status(404).json({ message: "User not found" });
        }
        const { password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await user.update({ password: hashedPassword }, { transaction: transxn });
        await forgotPasswordRequest.update({ isActive: false }, { transaction: transxn });
        await transxn.commit();
        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        if (transxn) {
            await transxn.rollback();
        }
        console.log(error);
        res.status(500).json(error);
    }
}


module.exports = {
    sendForgotPasswordEmail,
    resetPassword
}
