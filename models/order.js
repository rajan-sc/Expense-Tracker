const { DataTypes } = require("sequelize");
const sequelize = require("../utils/dbConnection");

const Order = sequelize.define("Order", {
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: "INR"
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: "PENDING" 
    },
    paymentSessionId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id"
        }
    }
});

module.exports = Order;
