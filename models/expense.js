const {DataTypes} = require("sequelize");
const sequalize = require("../utils/dbConnection");

const Expense = sequalize.define("expense", {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references:{
            model: "Users",
            key:"id"
        }
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    }
})

module.exports = Expense;
