const {Expense, User} = require("../models/index");
const sequelize = require("../utils/dbConnection");

const leaderBoard = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: [
                "name",
                [
                    sequelize.fn(
                        "COALESCE",
                        sequelize.fn("SUM", sequelize.col("expenses.amount")),
                        0
                    ),
                    "totalAmount"
                ]
            ],
            include: [
                {
                    model: Expense,
                    attributes: [],
                    required: false
                }
            ],
            group: ["User.id"],
            order: [
                [sequelize.literal("totalAmount"), "DESC"]
            ]
        });

        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {leaderBoard};
