const {createPaymentOrder, verifyPayment} = require("../controllers/paymentController");
const {authenticate} = require("../middleware/auth");
const express = require("express");
const router = express.Router();

router.post("/create-payment-order", authenticate, createPaymentOrder);
router.post("/verify-payment", authenticate, verifyPayment);

module.exports = router;
