const express = require("express");
const app = express();
const expenseRoutes = require("./routes/expense");
const sequelize = require("./utils/dbConnection");
const path = require("path");

app.use(express.json()); //middleware to parse json data

app.use(express.urlencoded({ extended: true })); //middleware to parse form data

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "home.html"));
});

app.use("/expense", expenseRoutes);

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
