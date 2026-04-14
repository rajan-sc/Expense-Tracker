const {createOrder, verifyPayment: verifyCashfreePayment} = require("../services/cashfreeservice");
const {Order, User} = require("../models/associations");

const createPaymentOrder = async (req, res) => {
    const orderId = "ORD" + Date.now();
    const orderAmount = 200;
    const userId = req.user.id;

    try{
        await Order.create({
            id: orderId,
            amount: orderAmount,
            status: "PENDING",
            userId: userId
        });
        const { paymentSessionId } = await createOrder(orderId, orderAmount, userId, req.user.name, req.user.email);
        await Order.update(
            { paymentSessionId: paymentSessionId },
            { where: { id: orderId } }
        );
        res.json({ paymentSessionId, orderId });
    }
    catch(error){
        console.log(error);
        res.status(500).json(error);
    }

}

const verifyPaymentOrder = async (req, res) => {
    try{
        const {orderId} = req.body;
        const response = await verifyCashfreePayment(orderId);
        
        // Cashfree marks order_status as 'PAID' if successful
        if(response.order_status === "PAID"){
            await Order.update({status: "SUCCESS"}, {where: {id: orderId}});
            await User.update({isPremium: true}, {where: {id: req.user.id}});
            res.json({ success: true, message: "Premium membership activated successfully" });
        }
        else{
            await Order.update({status: "FAILED"}, {where: {id: orderId}});
            res.json({ success: false, message: "Payment verification failed or is pending" });
        }
    }
    catch(error){
        console.log(error);
        res.status(500).json(error);
    }
}



module.exports = {createPaymentOrder, verifyPayment: verifyPaymentOrder};
