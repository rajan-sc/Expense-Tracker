const express = require("express");
const router = express.Router();
const { leaderBoard } = require("../controllers/leaderboard");

router.get("/", leaderBoard);

module.exports = router;
