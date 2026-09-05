const express = require("express");
const usersController = require("./controller");
const authenticateRequest = require("../../middlewares/authenticateRequest");
const asyncRouteHandler = require("../../utils/asyncRouteHandler");

const usersRouter = express.Router();

usersRouter.get("/me", authenticateRequest, asyncRouteHandler(usersController.getCurrentUserProfileHandler));

module.exports = usersRouter;
