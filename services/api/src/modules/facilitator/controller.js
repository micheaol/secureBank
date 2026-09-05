const facilitatorService = require("./service");
const environmentsService = require("../environments/service");
const { sendSuccessResponse } = require("../../utils/apiResponse");

async function getOverviewHandler(request, response) {
  const overview = await facilitatorService.getFloorOverview();
  return sendSuccessResponse(response, { message: "Overview retrieved successfully.", data: overview });
}

async function getLabHealthHandler(request, response) {
  const labHealth = await facilitatorService.getLabHealth();
  return sendSuccessResponse(response, { message: "Lab health retrieved successfully.", data: { labHealth } });
}

async function listParticipantsHandler(request, response) {
  const participants = await facilitatorService.listParticipants();
  return sendSuccessResponse(response, { message: "Participants retrieved successfully.", data: { participants } });
}

async function getParticipantDetailHandler(request, response) {
  const participant = await facilitatorService.getParticipantDetail(request.params.participantId);
  return sendSuccessResponse(response, { message: "Participant retrieved successfully.", data: { participant } });
}

async function extendParticipantEnvironmentHandler(request, response) {
  const environment = await environmentsService.privilegedExtendEnvironment(request.params.environmentId);
  return sendSuccessResponse(response, { message: "Environment extended.", data: { environment } });
}

async function resetParticipantEnvironmentHandler(request, response) {
  const environment = await environmentsService.privilegedTerminateEnvironment(request.params.environmentId);
  return sendSuccessResponse(response, { message: "Environment terminated.", data: { environment } });
}

module.exports = {
  getOverviewHandler,
  getLabHealthHandler,
  listParticipantsHandler,
  getParticipantDetailHandler,
  extendParticipantEnvironmentHandler,
  resetParticipantEnvironmentHandler,
};
