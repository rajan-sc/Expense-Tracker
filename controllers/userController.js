const User = require("../models/user");
const bcrypt = require("bcrypt");


const signup = async (req, res) => {
    const {name, email, password} = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({name, email, password: hashedPassword});
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
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) {
            return res.status(401).json({message: "Invalid password"});
        }
        res.status(200).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {signup, login};
