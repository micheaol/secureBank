const express = require("express");
const achievementsController = require("./controller");
const authenticateRequest = require("../../middlewares/authenticateRequest");
const asyncRouteHandler = require("../../utils/asyncRouteHandler");

const achievementsRouter = express.Router();

achievementsRouter.use(authenticateRequest);
achievementsRouter.get("/", asyncRouteHandler(achievementsController.listMyAchievementsHandler));

module.exports = achievementsRouter;
