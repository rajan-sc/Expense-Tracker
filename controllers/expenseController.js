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

const getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.findAll({where: {userId: req.user.id}});
        res.status(200).json(expenses);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


module.exports = {addExpense, getExpenses};

