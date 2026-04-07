const User = require("../models/expenseModel");


const signup = async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const user = await User.create({name, email, password});
        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {signup};
