const { Expense, User } = require("../models/index");
const sequelize = require("../utils/dbConnection");
const aiService = require("../services/aiService");

const addTotalExpense = async (userId, amount, t) => {
    await User.increment("totalExpense", { by: Number(amount), where: { id: userId }, transaction: t });
};

const subTotalExpense = async (userId, amount, t) => {
    await User.decrement("totalExpense", { by: Number(amount), where: { id: userId }, transaction: t });
};


const addExpense = async (req, res) => {
    const { amount, description } = req.body;
    const aiCategory = await aiService.categorizeExpense(description, amount);

    const t = await sequelize.transaction();
    try {
        const expense = await Expense.create({ userId: req.user.id, amount, category: aiCategory, description }, { transaction: t });
        await addTotalExpense(req.user.id, amount, t);
        await t.commit();
        res.status(201).json(expense);
    } catch (error) {
        await t.rollback();
        console.log(error);
        res.status(500).json(error);
    }
}

const getExpensesById = async (req, res) => {
    try {
        const expenses = await Expense.findAll({ where: { userId: req.user.id } });
        res.status(200).json(expenses);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const deleteExpense = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const expenseId = req.params.id;

        const expense = await Expense.findOne({ where: { id: expenseId, userId: req.user.id } });
        if (!expense) {
            await t.rollback();
            return res.status(404).json({ message: "Expense not found" });
        }

        await expense.destroy({ transaction: t });
        await subTotalExpense(req.user.id, expense.amount, t);

        await t.commit();
        res.json({ message: "Expense deleted successfully" });

    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: "Failed to delete expense" });
    }
};

const editExpense = async (req, res) => {
    const t = await sequelize.transaction();
    try {
        const expenseId = req.params.id;
        const { amount, description } = req.body;

        const oldExpense = await Expense.findOne({ where: { id: expenseId, userId: req.user.id } });
        if (!oldExpense) {
            await t.rollback();
            return res.status(404).json({ message: "Expense not found" });
        }

        const difference = Number(amount) - Number(oldExpense.amount);

        await oldExpense.update({ amount, description }, { transaction: t });

        if (difference > 0) {
            await addTotalExpense(req.user.id, difference, t);
        } else if (difference < 0) {
            await subTotalExpense(req.user.id, Math.abs(difference), t);
        }

        await t.commit();
        res.json({ message: "Expense updated successfully" });
    } catch (error) {
        await t.rollback();
        res.status(500).json({ message: "Failed to update expense" });
    }
}


const getInsights = async (req, res) => {
    try {
        const expenses = await Expense.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 20
        });

        if (expenses.length === 0) {
            return res.json({ insight: "You haven't tracked any expenses yet! Start tracking to get AI financial advice." });
        }

        const simplifiedExpenses = expenses.map(e => ({ amount: e.amount, category: e.category, desc: e.description }));
        
        const insightText = await aiService.generateFinancialInsight(simplifiedExpenses);

        res.json({ insight: insightText });
    } catch (err) {
        console.error("Insight rendering failed", err);
        res.status(500).json({ insight: "AI advisor is offline right now!" });
    }
}

module.exports = { addExpense, getExpensesById, deleteExpense, editExpense, getInsights };

