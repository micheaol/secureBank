const express = require("express");
const scoringController = require("./controller");
const authenticateRequest = require("../../middlewares/authenticateRequest");
const asyncRouteHandler = require("../../utils/asyncRouteHandler");

const scoringRouter = express.Router();

scoringRouter.use(authenticateRequest);
scoringRouter.get("/me", asyncRouteHandler(scoringController.getMyScoreHandler));
scoringRouter.get("/leaderboard", asyncRouteHandler(scoringController.getLeaderboardHandler));

module.exports = scoringRouter;
