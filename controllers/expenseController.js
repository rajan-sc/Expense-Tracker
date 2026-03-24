const Expense = require("../models/expenseModel");

const addExpense = async (req, res) =>{
    const {amount, description, category} = req.body;
    try {
        const expense = await Expense.create({amount, description, category});
        // res.status(201).json(expense);
        res.redirect("/");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getAllExpense = async (req, res) =>{
    try {
        const expenses = await Expense.findAll();
        res.status(200).json(expenses);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const updateExpense = async (req, res) =>{
    const {id, amount, description, category} = req.body;
    try {
        const expense = await Expense.update({amount, description, category}, {where: {id}});
        res.status(200).json(expense);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const deleteExpense = async (req, res) =>{
    const {id} = req.body;
    try {
        const expense = await Expense.destroy({where: {id}});
        res.status(200).json(expense);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {addExpense, getAllExpense, updateExpense, deleteExpense};
