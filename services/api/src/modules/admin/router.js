const express = require("express");
const adminController = require("./controller");
const authenticateRequest = require("../../middlewares/authenticateRequest");
const authorizeRoles = require("../../middlewares/authorizeRoles");
const validateRequestBody = require("../../middlewares/validateRequestBody");
const asyncRouteHandler = require("../../utils/asyncRouteHandler");
const { emergencyReasonRequestSchema } = require("../../validators/adminValidators");

const ADMIN_ROLES = ["sandbox_administrator", "administrator"];

const adminRouter = express.Router();

adminRouter.use(authenticateRequest, authorizeRoles(...ADMIN_ROLES));

adminRouter.get("/overview", asyncRouteHandler(adminController.getOverviewHandler));
adminRouter.get("/environments", asyncRouteHandler(adminController.listEnvironmentsHandler));
adminRouter.post("/environments/:environmentId/terminate", asyncRouteHandler(adminController.terminateEnvironmentHandler));
adminRouter.get("/audit-log", asyncRouteHandler(adminController.listAuditLogHandler));

adminRouter.get("/emergency", asyncRouteHandler(adminController.getEmergencyStatusHandler));
adminRouter.post(
  "/emergency/stop-provisioning",
  validateRequestBody(emergencyReasonRequestSchema),
  asyncRouteHandler(adminController.stopProvisioningHandler)
);
adminRouter.post(
  "/emergency/resume-provisioning",
  validateRequestBody(emergencyReasonRequestSchema),
  asyncRouteHandler(adminController.resumeProvisioningHandler)
);
adminRouter.post(
  "/emergency/labs/:labCode/disable",
  validateRequestBody(emergencyReasonRequestSchema),
  asyncRouteHandler(adminController.disableLabHandler)
);
adminRouter.post(
  "/emergency/labs/:labCode/enable",
  validateRequestBody(emergencyReasonRequestSchema),
  asyncRouteHandler(adminController.enableLabHandler)
);
adminRouter.post(
  "/emergency/labs/:labCode/terminate-environments",
  validateRequestBody(emergencyReasonRequestSchema),
  asyncRouteHandler(adminController.terminateAllEnvironmentsForLabHandler)
);
adminRouter.post(
  "/emergency/shutdown",
  validateRequestBody(emergencyReasonRequestSchema),
  asyncRouteHandler(adminController.emergencyShutdownHandler)
);
adminRouter.post(
  "/emergency/shutdown/lift",
  validateRequestBody(emergencyReasonRequestSchema),
  asyncRouteHandler(adminController.liftEmergencyShutdownHandler)
);

module.exports = adminRouter;
