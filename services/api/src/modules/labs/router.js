const express = require("express");
const labsController = require("./controller");
const challengesController = require("../challenges/controller");
const authenticateRequest = require("../../middlewares/authenticateRequest");
const asyncRouteHandler = require("../../utils/asyncRouteHandler");

const labsRouter = express.Router();

labsRouter.use(authenticateRequest);
labsRouter.get("/", asyncRouteHandler(labsController.listLabsHandler));
labsRouter.get("/:labCode", asyncRouteHandler(labsController.getLabByCodeHandler));
labsRouter.get("/:labCode/challenges", asyncRouteHandler(challengesController.listChallengesForLabHandler));

module.exports = labsRouter;
