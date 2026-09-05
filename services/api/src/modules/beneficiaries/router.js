const express = require("express");
const beneficiariesController = require("./controller");
const authenticateRequest = require("../../middlewares/authenticateRequest");
const validateRequestBody = require("../../middlewares/validateRequestBody");
const asyncRouteHandler = require("../../utils/asyncRouteHandler");
const { createBeneficiaryRequestSchema } = require("../../validators/beneficiaryValidators");

const beneficiariesRouter = express.Router();

beneficiariesRouter.use(authenticateRequest);
beneficiariesRouter.get("/", asyncRouteHandler(beneficiariesController.listMyBeneficiariesHandler));
beneficiariesRouter.post(
  "/",
  validateRequestBody(createBeneficiaryRequestSchema),
  asyncRouteHandler(beneficiariesController.addBeneficiaryHandler)
);
beneficiariesRouter.delete("/:beneficiaryId", asyncRouteHandler(beneficiariesController.removeBeneficiaryHandler));

module.exports = beneficiariesRouter;
