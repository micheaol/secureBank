const express = require("express");
const environmentsController = require("./controller");
const authenticateRequest = require("../../middlewares/authenticateRequest");
const asyncRouteHandler = require("../../utils/asyncRouteHandler");

const environmentsRouter = express.Router();

environmentsRouter.use(authenticateRequest);
environmentsRouter.post("/:environmentId/reset", asyncRouteHandler(environmentsController.resetEnvironmentHandler));
environmentsRouter.post("/:environmentId/terminate", asyncRouteHandler(environmentsController.terminateEnvironmentHandler));
environmentsRouter.post("/:environmentId/extend", asyncRouteHandler(environmentsController.extendEnvironmentHandler));

module.exports = environmentsRouter;
