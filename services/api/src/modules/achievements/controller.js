const achievementsService = require("./service");
const { sendSuccessResponse } = require("../../utils/apiResponse");

async function listMyAchievementsHandler(request, response) {
  const achievements = await achievementsService.listAllAchievementsWithUnlockStatus(request.authenticatedUser.userId);
  return sendSuccessResponse(response, { message: "Achievements retrieved successfully.", data: { achievements } });
}

module.exports = { listMyAchievementsHandler };
