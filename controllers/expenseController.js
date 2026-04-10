const {Expense} = require("../models/index")


const addExpense = async (req, res) => {
    const {amount, category, description} = req.body;
    try {
        const expense = await Expense.create({userId: req.user.id, amount, category, description});
        res.status(201).json(expense);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getExpensesById = async (req, res) => {
    try {
        const expenses = await Expense.findAll({where: {userId: req.user.id}});
        res.status(200).json(expenses);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;

        const deleted = await Expense.destroy({
            where: {
                id: expenseId,
                userId: req.user.id
            }
        });
        if(deleted === 0){
            return res.status(404).json({ message: "Expense not found" });
        }
        res.json({ message: "Expense deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Failed to delete expense" });
    }
};

const editExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const {amount, category, description} = req.body;
        const expense = await Expense.update({amount, category, description}, {where: {id: expenseId, userId: req.user.id}});
        res.json({ message: "Expense updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update expense" });
    }
}



module.exports = {addExpense, getExpensesById, deleteExpense, editExpense};

