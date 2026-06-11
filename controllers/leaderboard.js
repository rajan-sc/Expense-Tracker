const User = require("../models/user");

const leaderBoard = async (req, res) => {
    try {
        const users = await User.find({}, "name totalExpense").sort({ totalExpense: -1 });

        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = { leaderBoard };
