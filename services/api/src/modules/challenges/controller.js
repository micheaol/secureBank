const challengesService = require("./service");
const { sendSuccessResponse } = require("../../utils/apiResponse");

function extractRequestContext(request) {
  return { ipAddress: request.ip, userAgent: request.headers["user-agent"] };
}

async function listChallengesForLabHandler(request, response) {
  const result = await challengesService.listChallengesForLab(request.authenticatedUser.userId, request.params.labCode);
  return sendSuccessResponse(response, { message: "Challenges retrieved successfully.", data: result });
}

async function getChallengeDetailHandler(request, response) {
  const challenge = await challengesService.getChallengeDetail(
    request.authenticatedUser.userId,
    request.params.challengeCode
  );
  return sendSuccessResponse(response, { message: "Challenge retrieved successfully.", data: { challenge } });
}

async function startChallengeHandler(request, response) {
  const result = await challengesService.startChallenge(request.authenticatedUser.userId, request.params.challengeCode);
  return sendSuccessResponse(response, { message: "Challenge started.", data: result });
}

async function revealHintHandler(request, response) {
  const hint = await challengesService.revealHint(
    request.authenticatedUser.userId,
    request.params.challengeCode,
    Number(request.params.hintOrder)
  );
  return sendSuccessResponse(response, { message: "Hint revealed.", data: { hint } });
}

async function submitAnswerHandler(request, response) {
  const result = await challengesService.submitAnswer(
    request.authenticatedUser.userId,
    request.params.challengeCode,
    request.validatedBody,
    extractRequestContext(request)
  );
  return sendSuccessResponse(response, {
    message: result.correct ? "Correct - vulnerability confirmed." : "Validation failed. Try again.",
    data: result,
  });
}

async function remediateChallengeHandler(request, response) {
  const result = await challengesService.remediateChallenge(
    request.authenticatedUser.userId,
    request.params.challengeCode,
    extractRequestContext(request)
  );
  return sendSuccessResponse(response, { message: "Remediation verified.", data: result });
}

async function resetChallengeForParticipantHandler(request, response) {
  const result = await challengesService.resetChallengeForParticipant(
    request.authenticatedUser.userId,
    request.authenticatedUser.roleName,
    request.params.targetUserId,
    request.params.challengeCode,
    extractRequestContext(request)
  );
  return sendSuccessResponse(response, { message: "Challenge reset for participant.", data: result });
}

module.exports = {
  listChallengesForLabHandler,
  getChallengeDetailHandler,
  startChallengeHandler,
  revealHintHandler,
  submitAnswerHandler,
  remediateChallengeHandler,
  resetChallengeForParticipantHandler,
};
