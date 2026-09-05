const teamsService = require("./service");
const { sendSuccessResponse } = require("../../utils/apiResponse");

async function getMyTeamHandler(request, response) {
  const team = await teamsService.getMyTeam(request.authenticatedUser.userId);
  return sendSuccessResponse(response, { message: "Team retrieved successfully.", data: { team } });
}

async function joinTeamHandler(request, response) {
  const team = await teamsService.joinOrCreateTeam(request.authenticatedUser.userId, request.validatedBody.teamName);
  return sendSuccessResponse(response, { message: "Joined team successfully.", data: { team } });
}

async function leaveTeamHandler(request, response) {
  await teamsService.leaveTeam(request.authenticatedUser.userId);
  return sendSuccessResponse(response, { message: "Left team successfully." });
}

async function getTeamLeaderboardHandler(request, response) {
  const leaderboard = await teamsService.getTeamLeaderboard();
  return sendSuccessResponse(response, { message: "Team leaderboard retrieved successfully.", data: { leaderboard } });
}

module.exports = {
  getMyTeamHandler,
  joinTeamHandler,
  leaveTeamHandler,
  getTeamLeaderboardHandler,
};
