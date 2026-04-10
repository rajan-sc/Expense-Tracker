const express = require("express");
const router = express.Router();
const {signup, login, getUserInfo} = require("../controllers/userController");
const {addExpense, getExpensesById, deleteExpense, editExpense} = require("../controllers/expenseController");
const {authenticate} = require("../middleware/auth");
const {leaderBoard} = require("../controllers/leaderboard");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", authenticate, getUserInfo);
router.post("/expense/add-expense", authenticate, addExpense);
router.get("/expense/get-expenses", authenticate, getExpensesById);
router.delete("/expense/delete-expense/:id", authenticate, deleteExpense);
router.put("/expense/edit-expense/:id", authenticate, editExpense);
router.get("/expense/leaderboard", leaderBoard);

module.exports = router;
