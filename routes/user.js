const express = require("express");
const router = express.Router();
const { signup, login, getUserInfo } = require("../controllers/userController");
const { authenticate } = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authenticate, getUserInfo);

module.exports = router;
