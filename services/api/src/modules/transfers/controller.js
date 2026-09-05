const transfersService = require("./service");
const { sendSuccessResponse } = require("../../utils/apiResponse");

function extractRequestContext(request) {
  return { ipAddress: request.ip, userAgent: request.headers["user-agent"] };
}

async function listMyTransfersHandler(request, response) {
  const transfers = await transfersService.listTransfersForUser(request.authenticatedUser.userId);
  return sendSuccessResponse(response, { message: "Transfers retrieved successfully.", data: { transfers } });
}

async function initiateTransferHandler(request, response) {
  const transfer = await transfersService.initiateTransfer(
    request.authenticatedUser.userId,
    request.validatedBody,
    extractRequestContext(request)
  );
  return sendSuccessResponse(response, {
    statusCode: 201,
    message: "Enter the authorization code sent to your registered number to confirm this transfer.",
    data: { transfer },
  });
}

async function confirmTransferHandler(request, response) {
  const transfer = await transfersService.confirmTransfer(
    request.authenticatedUser.userId,
    request.params.transferId,
    request.validatedBody.otpCode,
    extractRequestContext(request)
  );
  return sendSuccessResponse(response, { message: "Transfer successful.", data: { transfer } });
}

module.exports = {
  listMyTransfersHandler,
  initiateTransferHandler,
  confirmTransferHandler,
};
