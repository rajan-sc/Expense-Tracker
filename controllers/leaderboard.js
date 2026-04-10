const {Expense, User} = require("../models/index");
const sequelize = require("../utils/dbConnection");

const leaderBoard = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: [
                "name",
                "totalExpense"
            ],
            order: [
                ["totalExpense", "DESC"]
            ]
        });

        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {leaderBoard};
