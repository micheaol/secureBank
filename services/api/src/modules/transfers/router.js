const express = require("express");
const transfersController = require("./controller");
const authenticateRequest = require("../../middlewares/authenticateRequest");
const validateRequestBody = require("../../middlewares/validateRequestBody");
const asyncRouteHandler = require("../../utils/asyncRouteHandler");
const {
  initiateTransferRequestSchema,
  confirmTransferRequestSchema,
} = require("../../validators/transferValidators");

const transfersRouter = express.Router();

transfersRouter.use(authenticateRequest);
transfersRouter.get("/", asyncRouteHandler(transfersController.listMyTransfersHandler));
transfersRouter.post(
  "/",
  validateRequestBody(initiateTransferRequestSchema),
  asyncRouteHandler(transfersController.initiateTransferHandler)
);
transfersRouter.post(
  "/:transferId/confirm",
  validateRequestBody(confirmTransferRequestSchema),
  asyncRouteHandler(transfersController.confirmTransferHandler)
);

module.exports = transfersRouter;
