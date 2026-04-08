const express = require("express");
const router = express.Router();
const {signup, login} = require("../controllers/userController");
const {addExpense, getExpenses} = require("../controllers/expenseController");
const {authenticate} = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.post("/expense/add-expense", authenticate, addExpense);
router.get("/expense/get-expenses", authenticate, getExpenses);

module.exports = router;
