const express = require("express");
const challengesController = require("./controller");
const authenticateRequest = require("../../middlewares/authenticateRequest");
const authorizeRoles = require("../../middlewares/authorizeRoles");
const validateRequestBody = require("../../middlewares/validateRequestBody");
const asyncRouteHandler = require("../../utils/asyncRouteHandler");
const { submitAnswerRequestSchema } = require("../../validators/challengeValidators");

const challengesRouter = express.Router();

challengesRouter.use(authenticateRequest);
challengesRouter.get("/:challengeCode", asyncRouteHandler(challengesController.getChallengeDetailHandler));
challengesRouter.post("/:challengeCode/start", asyncRouteHandler(challengesController.startChallengeHandler));
challengesRouter.post("/:challengeCode/hints/:hintOrder", asyncRouteHandler(challengesController.revealHintHandler));
challengesRouter.post(
  "/:challengeCode/submit",
  validateRequestBody(submitAnswerRequestSchema),
  asyncRouteHandler(challengesController.submitAnswerHandler)
);
challengesRouter.post("/:challengeCode/remediate", asyncRouteHandler(challengesController.remediateChallengeHandler));
challengesRouter.post(
  "/:challengeCode/reset/:targetUserId",
  authorizeRoles("lab_facilitator", "sandbox_administrator", "administrator"),
  asyncRouteHandler(challengesController.resetChallengeForParticipantHandler)
);

module.exports = challengesRouter;
