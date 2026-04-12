const express = require("express");
const app = express();
const userRoutes = require("./routes/user");
const expenseRoutes = require("./routes/expense");
const leaderboardRoutes = require("./routes/leaderboard");
const sequelize = require("./utils/dbConnection");
const path = require("path");
const paymentRoutes = require("./routes/payment");
const forgotPassRoutes = require("./routes/forgotPassword");

app.use(express.json()); //middleware to parse json data

app.use(express.urlencoded({ extended: true })); //middleware to parse form data

app.use(express.static(path.join(__dirname, "public")));


app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "signup.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "login.html"));
});

app.get("/forgot-password", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "forgotPass.html"));
});

app.get("/expense", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "expense.html"));
});

app.get("/payment", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "payment.html"));
});

app.get("/payment-status/:orderId", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "status.html"));
});

app.get("/password/reset-password/:uuid", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "resetPass.html"));
});

app.use("/user", userRoutes);
app.use("/expense", expenseRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/payment", paymentRoutes);
app.use("/password", forgotPassRoutes);

sequelize.sync({force: false})
    .then(() => {
        console.log("Database synced");
    })
    .catch((error) => {
        console.log(error);
    });

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
