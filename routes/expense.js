const express = require("express");
const router = express.Router();
const {addExpense, getAllExpense, updateExpense, deleteExpense} = require("../controllers/expenseController");

router.post("/add-expense", addExpense);
router.get("/expenses", getAllExpense);
router.put("/update-expense", updateExpense);
router.delete("/delete-expense", deleteExpense);

module.exports = router;
