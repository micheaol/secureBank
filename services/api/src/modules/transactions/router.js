const express = require("express");
const transactionsController = require("./controller");
const authenticateRequest = require("../../middlewares/authenticateRequest");
const asyncRouteHandler = require("../../utils/asyncRouteHandler");

const transactionsRouter = express.Router();

transactionsRouter.use(authenticateRequest);
transactionsRouter.get("/", asyncRouteHandler(transactionsController.listMyTransactionsHandler));
transactionsRouter.get("/:transactionId", asyncRouteHandler(transactionsController.getMyTransactionByIdHandler));

module.exports = transactionsRouter;
