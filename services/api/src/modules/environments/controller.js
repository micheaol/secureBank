const environmentsService = require("./service");
const { sendSuccessResponse } = require("../../utils/apiResponse");

async function resetEnvironmentHandler(request, response) {
  const environment = await environmentsService.resetEnvironment(
    request.authenticatedUser.userId,
    request.params.environmentId
  );
  return sendSuccessResponse(response, { message: "Environment reset.", data: { environment } });
}

async function terminateEnvironmentHandler(request, response) {
  const environment = await environmentsService.terminateEnvironment(
    request.authenticatedUser.userId,
    request.params.environmentId
  );
  return sendSuccessResponse(response, { message: "Environment terminated.", data: { environment } });
}

async function extendEnvironmentHandler(request, response) {
  const environment = await environmentsService.extendEnvironment(
    request.authenticatedUser.userId,
    request.params.environmentId
  );
  return sendSuccessResponse(response, { message: "Environment extended.", data: { environment } });
}

module.exports = {
  resetEnvironmentHandler,
  terminateEnvironmentHandler,
  extendEnvironmentHandler,
};
