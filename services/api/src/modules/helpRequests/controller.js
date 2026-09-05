const helpRequestsService = require("./service");
const { sendSuccessResponse } = require("../../utils/apiResponse");

async function requestHelpHandler(request, response) {
  const helpRequest = await helpRequestsService.requestHelp(
    request.authenticatedUser.userId,
    request.body?.labCode,
    request.body?.reason || "Assistance requested"
  );
  return sendSuccessResponse(response, { statusCode: 201, message: "Facilitator requested.", data: { helpRequest } });
}

async function listOpenHelpRequestsHandler(request, response) {
  const helpRequests = await helpRequestsService.listOpenHelpRequests();
  return sendSuccessResponse(response, { message: "Help queue retrieved successfully.", data: { helpRequests } });
}

async function resolveHelpRequestHandler(request, response) {
  const helpRequest = await helpRequestsService.resolveHelpRequest(request.params.helpRequestId);
  return sendSuccessResponse(response, { message: "Help request resolved.", data: { helpRequest } });
}

module.exports = { requestHelpHandler, listOpenHelpRequestsHandler, resolveHelpRequestHandler };
