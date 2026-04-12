const express = require("express");
const router = express.Router();
const {sendForgotPasswordEmail, resetPassword} = require("../controllers/forgotPassController");

router.post("/forgot-password", sendForgotPasswordEmail);
router.post("/reset-password/:uuid", resetPassword);

module.exports = router;
