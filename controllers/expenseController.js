const Expense = require("../models/expense");
const User = require("../models/user");
const DownloadHistory = require("../models/downloadHistory");
const mongoose = require("mongoose");
const aiService = require("../services/aiService");
const s3 = require("../services/awsS3Service");

const addTotalExpense = async (userId, amount) => {
    await User.updateOne(
        { _id: userId },
        { $inc: { totalExpense: Number(amount) } }
    );
};

const subTotalExpense = async (userId, amount) => {
    await User.updateOne(
        { _id: userId },
        { $inc: { totalExpense: -Number(amount) } }
    );
};

const addExpense = async (req, res) => {
    const { amount, description, notes } = req.body;
    const aiCategory = await aiService.categorizeExpense(description, amount);

    try {
        const expense = new Expense({
            userId: req.user.id,
            amount,
            category: aiCategory,
            description,
            notes
        });
        await expense.save();
        await addTotalExpense(req.user.id, amount);
        res.status(201).json(expense);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getExpensesById = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit;

        const expenses = await Expense.find({ userId: req.user.id })
            .skip(skip)
            .limit(limit);
        
        const count = await Expense.countDocuments({ userId: req.user.id });

        const aggregationResult = await Expense.aggregate([
            { $match: { userId: new mongoose.Types.ObjectId(req.user.id) } },
            { $group: { _id: null, totalAmount: { $sum: "$amount" } } }
        ]);
        const totalAmount = aggregationResult.length > 0 ? aggregationResult[0].totalAmount : 0;

        res.status(200).json({
            expenses: expenses,
            totalAmount: totalAmount,
            currentPage: page,
            hasNextPage: limit * page < count,
            nextPage: page + 1,
            hasPreviousPage: page > 1,
            previousPage: page - 1,
            lastPage: Math.ceil(count / limit)
        });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const deleteExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;

        const expense = await Expense.findOne({ _id: expenseId, userId: req.user.id });
        if (!expense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        await Expense.deleteOne({ _id: expenseId });
        await subTotalExpense(req.user.id, expense.amount);

        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete expense" });
    }
};

const editExpense = async (req, res) => {
    try {
        const expenseId = req.params.id;
        const { amount, description, notes } = req.body;

        const oldExpense = await Expense.findOne({ _id: expenseId, userId: req.user.id });
        if (!oldExpense) {
            return res.status(404).json({ message: "Expense not found" });
        }

        const difference = Number(amount) - Number(oldExpense.amount);

        oldExpense.amount = amount;
        oldExpense.description = description;
        oldExpense.notes = notes;
        await oldExpense.save();

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

const getInsights = async (req, res) => {
    try {
        if (!req.user.isPremium) {
            return res.status(403).json({ insight: "AI Advisor is a premium feature. Upgrade to premium!" });
        }
        const expenses = await Expense.find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .limit(20);

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

const downloadExpenses = async (req, res) => {
    try {
        if (!req.user.isPremium) {
            return res.status(403).json({ message: "Download is a premium feature." });
        }
        const expenses = await Expense.find({ userId: req.user.id });
        const stringifiedExpenses = JSON.stringify(expenses);
        console.log(stringifiedExpenses);

        const fileUrl = await s3.uploadToS3(stringifiedExpenses, `${req.user.id}/expenses_${new Date().toISOString()}.txt`);
        
        await DownloadHistory.create({
            fileUrl: fileUrl,
            userId: req.user.id
        });
        
        res.status(200).json({ fileUrl });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to download expenses" });
    }
}

const getDownloadHistory = async (req, res) => {
    try {
        if (!req.user.isPremium) {
            return res.status(403).json({ message: "Download history is a premium feature." });
        }
        const history = await DownloadHistory.find({ userId: req.user.id })
            .sort({ _id: -1 });
            
        // Map over the results to ensure createdAt is present for older records
        const formattedHistory = history.map(doc => {
            const obj = doc.toObject();
            if (!obj.createdAt) {
                obj.createdAt = doc._id.getTimestamp();
            }
            return obj;
        });
            
        res.status(200).json({ history: formattedHistory });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to fetch download history" });
    }
}

module.exports = { addExpense, getExpensesById, deleteExpense, editExpense, getInsights, downloadExpenses, getDownloadHistory };
