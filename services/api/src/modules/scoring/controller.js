const scoringService = require("./service");
const { sendSuccessResponse } = require("../../utils/apiResponse");

async function getMyScoreHandler(request, response) {
  const scoreSummary = await scoringService.getScoreAndRankForUser(request.authenticatedUser.userId);
  return sendSuccessResponse(response, { message: "Score retrieved successfully.", data: scoreSummary });
}

async function getLeaderboardHandler(request, response) {
  const leaderboard = await scoringService.getIndividualLeaderboard();
  return sendSuccessResponse(response, { message: "Leaderboard retrieved successfully.", data: { leaderboard } });
}

module.exports = { getMyScoreHandler, getLeaderboardHandler };
