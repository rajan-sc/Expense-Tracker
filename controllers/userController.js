const User = require("../models/user");


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

const login = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({where: {email}});
        if(!user) {
            return res.status(404).json({message: "User not found"});
        }
        if(user.password !== password) {
            return res.status(401).json({message: "Invalid password"});
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {signup, login};
