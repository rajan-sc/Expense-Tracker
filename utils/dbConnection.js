const {Sequelize} = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(process.env.SQL_DB, process.env.SQL_USERNAME, process.env.SQL_PASS, {
    host: process.env.SQL_HOST,
    dialect: "mysql",
});

module.exports = sequelize;

