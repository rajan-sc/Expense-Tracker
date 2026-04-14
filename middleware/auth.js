const jwt = require("jsonwebtoken");
const { User } = require("../models/associations");

const authenticate = async (req, res, next) => {
    try {
        const token = req.header("Authorization");
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
        const user = await User.findByPk(decoded.userId);
        if (!user) {
            throw new Error();
        }
        req.user = user;
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ success: false, message: "Authentication failed" });
    }
}

module.exports = { authenticate };
