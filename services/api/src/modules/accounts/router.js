const express = require("express");
const accountsController = require("./controller");
const authenticateRequest = require("../../middlewares/authenticateRequest");
const asyncRouteHandler = require("../../utils/asyncRouteHandler");

const accountsRouter = express.Router();

accountsRouter.use(authenticateRequest);
accountsRouter.get("/", asyncRouteHandler(accountsController.listMyAccountsHandler));
accountsRouter.get("/:accountId", asyncRouteHandler(accountsController.getMyAccountByIdHandler));

module.exports = accountsRouter;
