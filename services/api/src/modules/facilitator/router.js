const express = require("express");
const facilitatorController = require("./controller");
const authenticateRequest = require("../../middlewares/authenticateRequest");
const authorizeRoles = require("../../middlewares/authorizeRoles");
const asyncRouteHandler = require("../../utils/asyncRouteHandler");

const FACILITATOR_ROLES = ["lab_facilitator", "sandbox_administrator", "administrator"];

const facilitatorRouter = express.Router();

facilitatorRouter.use(authenticateRequest, authorizeRoles(...FACILITATOR_ROLES));
facilitatorRouter.get("/overview", asyncRouteHandler(facilitatorController.getOverviewHandler));
facilitatorRouter.get("/lab-health", asyncRouteHandler(facilitatorController.getLabHealthHandler));
facilitatorRouter.get("/participants", asyncRouteHandler(facilitatorController.listParticipantsHandler));
facilitatorRouter.get("/participants/:participantId", asyncRouteHandler(facilitatorController.getParticipantDetailHandler));
facilitatorRouter.post(
  "/environments/:environmentId/extend",
  asyncRouteHandler(facilitatorController.extendParticipantEnvironmentHandler)
);
facilitatorRouter.post(
  "/environments/:environmentId/reset",
  asyncRouteHandler(facilitatorController.resetParticipantEnvironmentHandler)
);

module.exports = facilitatorRouter;
