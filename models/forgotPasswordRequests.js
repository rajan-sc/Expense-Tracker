const {DataTypes} = require("sequelize");
const sequalize = require("../utils/dbConnection");
const {v4: uuidv4} = require("uuid");

const ForgotPasswordRequest = sequalize.define("ForgotPasswordRequest", {
    id: {
        type: DataTypes.UUID,
        defaultValue: uuidv4,
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Users",
            key: "id"
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
});

module.exports = ForgotPasswordRequest;
