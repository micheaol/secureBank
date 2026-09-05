const express = require("express");
const helpRequestsController = require("./controller");
const authenticateRequest = require("../../middlewares/authenticateRequest");
const authorizeRoles = require("../../middlewares/authorizeRoles");
const asyncRouteHandler = require("../../utils/asyncRouteHandler");

const helpRequestsRouter = express.Router();

helpRequestsRouter.use(authenticateRequest);
helpRequestsRouter.post("/", asyncRouteHandler(helpRequestsController.requestHelpHandler));
helpRequestsRouter.get(
  "/",
  authorizeRoles("lab_facilitator", "sandbox_administrator", "administrator"),
  asyncRouteHandler(helpRequestsController.listOpenHelpRequestsHandler)
);
helpRequestsRouter.patch(
  "/:helpRequestId/resolve",
  authorizeRoles("lab_facilitator", "sandbox_administrator", "administrator"),
  asyncRouteHandler(helpRequestsController.resolveHelpRequestHandler)
);

module.exports = helpRequestsRouter;
