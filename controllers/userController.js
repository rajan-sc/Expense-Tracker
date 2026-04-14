const { User } = require("../models/associations");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateAccessToken = (id) => {
    return jwt.sign({ userId: id }, process.env.TOKEN_SECRET);
}

const signup = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User created successfully", token: generateAccessToken(user.id) });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        res.status(200).json({ message: "Login successful", token: generateAccessToken(user.id) });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const getUserInfo = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ isPremium: user.isPremium, name: user.name });
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}


module.exports = { signup, login, getUserInfo };
