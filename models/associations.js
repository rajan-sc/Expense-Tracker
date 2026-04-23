const User = require("./user");
const Expense = require("./expense");
const Order = require("./order");
const ForgotPasswordRequest = require("./forgotPasswordRequests");
const DownloadHistory = require("./downloadHistory");

User.hasMany(Expense, {foreignKey: "userId"});
Expense.belongsTo(User, {foreignKey: "userId"});

User.hasMany(Order, {foreignKey: "userId"});
Order.belongsTo(User, {foreignKey: "userId"});

User.hasMany(ForgotPasswordRequest, {foreignKey: "userId"});
ForgotPasswordRequest.belongsTo(User, {foreignKey: "userId"});

User.hasMany(DownloadHistory, {foreignKey: "userId"});
DownloadHistory.belongsTo(User, {foreignKey: "userId"});

module.exports = {User, Expense, Order, ForgotPasswordRequest, DownloadHistory};
