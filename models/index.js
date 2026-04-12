const User = require("./user");
const Expense = require("./expense");
const Order = require("./order");
const ForgotPasswordRequest = require("./forgotPasswordRequests");

User.hasMany(Expense, {foreignKey: "userId"});
Expense.belongsTo(User, {foreignKey: "userId"});

User.hasMany(Order, {foreignKey: "userId"});
Order.belongsTo(User, {foreignKey: "userId"});

User.hasMany(ForgotPasswordRequest, {foreignKey: "userId"});
ForgotPasswordRequest.belongsTo(User, {foreignKey: "userId"});

module.exports = {User, Expense, Order, ForgotPasswordRequest};
