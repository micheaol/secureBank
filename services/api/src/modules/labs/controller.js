const labsService = require("./service");
const { sendSuccessResponse } = require("../../utils/apiResponse");

async function listLabsHandler(request, response) {
  const labs = await labsService.listLabsWithProgressForUser(request.authenticatedUser.userId);
  return sendSuccessResponse(response, { message: "Labs retrieved successfully.", data: { labs } });
}

async function getLabByCodeHandler(request, response) {
  const lab = await labsService.getLabByCode(request.params.labCode);
  return sendSuccessResponse(response, { message: "Lab retrieved successfully.", data: { lab } });
}

module.exports = {
  listLabsHandler,
  getLabByCodeHandler,
};
