const usersModel = require("./model");
const { ApplicationError } = require("../../utils/apiResponse");

async function getCurrentUserProfile(userId) {
  const user = await usersModel.findUserById(userId);

  if (!user) {
    throw new ApplicationError("User account could not be found.", 404);
  }

  return user;
}

module.exports = {
  getCurrentUserProfile,
};
