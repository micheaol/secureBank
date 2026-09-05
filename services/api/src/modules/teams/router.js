const express = require("express");
const teamsController = require("./controller");
const authenticateRequest = require("../../middlewares/authenticateRequest");
const validateRequestBody = require("../../middlewares/validateRequestBody");
const asyncRouteHandler = require("../../utils/asyncRouteHandler");
const { joinTeamRequestSchema } = require("../../validators/teamValidators");

const teamsRouter = express.Router();

teamsRouter.use(authenticateRequest);
teamsRouter.get("/me", asyncRouteHandler(teamsController.getMyTeamHandler));
teamsRouter.post("/join", validateRequestBody(joinTeamRequestSchema), asyncRouteHandler(teamsController.joinTeamHandler));
teamsRouter.post("/leave", asyncRouteHandler(teamsController.leaveTeamHandler));
teamsRouter.get("/leaderboard", asyncRouteHandler(teamsController.getTeamLeaderboardHandler));

module.exports = teamsRouter;
