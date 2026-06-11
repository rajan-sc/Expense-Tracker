const { createOrder, verifyPayment: verifyCashfreePayment } = require("../services/cashfreeservice");
const Order = require("../models/order");
const User = require("../models/user");

const createPaymentOrder = async (req, res) => {
    const orderId = "ORD" + Date.now();
    const orderAmount = 200;
    const userId = req.user.id;

    try {
        await Order.create({
            _id: orderId,
            amount: orderAmount,
            status: "PENDING",
            userId: userId
        });
        const { paymentSessionId } = await createOrder(orderId, orderAmount, userId, req.user.name, req.user.email);
        
        await Order.updateOne(
            { _id: orderId },
            { $set: { paymentSessionId: paymentSessionId } }
        );
        res.json({ paymentSessionId, orderId });
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }

}

const verifyPaymentOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const response = await verifyCashfreePayment(orderId);
        
        // Cashfree marks order_status as 'PAID' if successful
        if (response.order_status === "PAID") {
            await Order.updateOne({ _id: orderId }, { $set: { status: "SUCCESS" } });
            await User.updateOne({ _id: req.user.id }, { $set: { isPremium: true } });
            res.json({ success: true, message: "Premium membership activated successfully" });
        }
        else {
            await Order.updateOne({ _id: orderId }, { $set: { status: "FAILED" } });
            res.json({ success: false, message: "Payment verification failed or is pending" });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = { createPaymentOrder, verifyPayment: verifyPaymentOrder };
