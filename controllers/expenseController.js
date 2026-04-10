const {Expense, User} = require("../models/index")

const addTotalExpense = async (userId, amount) => {
    await User.increment("totalExpense", { by: Number(amount), where: { id: userId } });
};

const subTotalExpense = async (userId, amount) => {
    await User.decrement("totalExpense", { by: Number(amount), where: { id: userId } });
};


const addExpense = async (req, res) => {
    const {amount, category, description} = req.body;
    try {
        const expense = await Expense.create({userId: req.user.id, amount, category, description});
        await addTotalExpense(req.user.id, amount);
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

        const expense = await Expense.findOne({ where: { id: expenseId, userId: req.user.id } });
        if(!expense){
            return res.status(404).json({ message: "Expense not found" });
        }

        await expense.destroy();
        await subTotalExpense(req.user.id, expense.amount);
        res.json({ message: "Expense deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Failed to delete expense" });
    }
};

const editExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const {amount, category, description} = req.body;
        
        const oldExpense = await Expense.findOne({ where: { id: expenseId, userId: req.user.id } });
        if(!oldExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }
        
        const difference = Number(amount) - Number(oldExpense.amount);
        
        await oldExpense.update({amount, category, description});
        
        if (difference > 0) {
            await addTotalExpense(req.user.id, difference);
        } else if (difference < 0) {
            await subTotalExpense(req.user.id, Math.abs(difference));
        }

        res.json({ message: "Expense updated successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to update expense" });
    }
}

module.exports = {addExpense, getExpensesById, deleteExpense, editExpense};

