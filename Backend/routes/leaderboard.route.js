const express = require("express");

const lboardRouter = express.Router()

const {leaderboardHandler} = require("../controllers/user.controller");


lboardRouter.get("/",leaderboardHandler);


module.exports ={lboardRouter}




