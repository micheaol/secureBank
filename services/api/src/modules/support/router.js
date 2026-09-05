const express = require("express");
const supportController = require("./controller");
const authenticateRequest = require("../../middlewares/authenticateRequest");
const authorizeRoles = require("../../middlewares/authorizeRoles");
const validateRequestBody = require("../../middlewares/validateRequestBody");
const asyncRouteHandler = require("../../utils/asyncRouteHandler");
const {
  createTicketRequestSchema,
  createMessageRequestSchema,
  updateTicketStatusRequestSchema,
} = require("../../validators/supportValidators");

const supportRouter = express.Router();

supportRouter.use(authenticateRequest);

supportRouter.get("/", asyncRouteHandler(supportController.listMyTicketsHandler));
supportRouter.post(
  "/",
  validateRequestBody(createTicketRequestSchema),
  asyncRouteHandler(supportController.createTicketHandler)
);
supportRouter.get("/:ticketId", asyncRouteHandler(supportController.getMyTicketByIdHandler));
supportRouter.post(
  "/:ticketId/messages",
  validateRequestBody(createMessageRequestSchema),
  asyncRouteHandler(supportController.addMessageToMyTicketHandler)
);

const AGENT_ROLES = ["support_agent", "administrator"];

supportRouter.get(
  "/agent/tickets",
  authorizeRoles(...AGENT_ROLES),
  asyncRouteHandler(supportController.listAllTicketsForAgentsHandler)
);
supportRouter.get(
  "/agent/tickets/:ticketId",
  authorizeRoles(...AGENT_ROLES),
  asyncRouteHandler(supportController.getTicketForAgentHandler)
);
supportRouter.post(
  "/agent/tickets/:ticketId/messages",
  authorizeRoles(...AGENT_ROLES),
  validateRequestBody(createMessageRequestSchema),
  asyncRouteHandler(supportController.replyToTicketAsAgentHandler)
);
supportRouter.patch(
  "/agent/tickets/:ticketId/status",
  authorizeRoles(...AGENT_ROLES),
  validateRequestBody(updateTicketStatusRequestSchema),
  asyncRouteHandler(supportController.updateTicketStatusHandler)
);

module.exports = supportRouter;
