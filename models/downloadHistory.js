const {DataTypes} = require("sequelize");
const sequelize = require("../utils/dbConnection");

const DownloadHistory = sequelize.define("downloadHistory", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    fileUrl: {
        type: DataTypes.STRING,
        allowNull: false
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

module.exports = DownloadHistory;
