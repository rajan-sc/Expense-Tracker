const express = require("express");
const router = express.Router();
const { addExpense, getExpensesById, deleteExpense, editExpense, getInsights } = require("../controllers/expenseController");
const { authenticate } = require("../middleware/auth");

router.post("/add-expense", authenticate, addExpense);
router.get("/get-expenses", authenticate, getExpensesById);
router.delete("/delete-expense/:id", authenticate, deleteExpense);
router.put("/edit-expense/:id", authenticate, editExpense);
router.get("/insights", authenticate, getInsights);

module.exports = router;
