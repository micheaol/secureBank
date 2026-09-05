const usersService = require("./service");
const { sendSuccessResponse } = require("../../utils/apiResponse");

async function getCurrentUserProfileHandler(request, response) {
  const currentUserProfile = await usersService.getCurrentUserProfile(
    request.authenticatedUser.userId
  );

  return sendSuccessResponse(response, {
    message: "Current user profile retrieved successfully.",
    data: { user: currentUserProfile },
  });
}

module.exports = {
  getCurrentUserProfileHandler,
};
