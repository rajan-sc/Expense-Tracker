const { Cashfree, CFEnvironment } = require("cashfree-pg");
require("dotenv").config();

const cashfree = new Cashfree(
    CFEnvironment.SANDBOX,
    process.env.CASHFREE_APPID,
    process.env.CASHFREE_SECRETKEY
);

const createOrder = async (orderId, orderAmount, userId, customerName, customerEmail) => {
    try{
    const expiryTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
    const request = {
        "order_id": orderId,
        "order_amount": orderAmount,
        "order_currency": "INR",
        "customer_details": {
            "customer_id": userId.toString(),
            "customer_phone": "9999999999", // Cashfree requires a phone number
            "customer_name": customerName || "Test User",
            "customer_email": customerEmail || "test@example.com"
        },
        "order_meta": {
            "return_url": "http://localhost:3000/payment-status/" + orderId
        },
        order_expiry_time: expiryTime,
    };


    const response = await cashfree.PGCreateOrder(request);
    return {
        paymentSessionId: response.data.payment_session_id,
        orderId: response.data.order_id
    };
    }
    catch(error){
        const detailedError = error.response ? error.response.data : error.message;
        console.error("Cashfree Error:", detailedError);
        throw new Error(error.response ? JSON.stringify(detailedError) : error.message);
    }
}

const verifyPayment = async (orderId) => {
    try{
        const response = await cashfree.PGFetchOrder(orderId);
        return response.data;
    }
    catch(error){
        const detailedError = error.response ? error.response.data : error.message;
        console.error("Cashfree Error:", detailedError);
        throw new Error(error.response ? JSON.stringify(detailedError) : error.message);
    }
}

module.exports = {createOrder, verifyPayment};
