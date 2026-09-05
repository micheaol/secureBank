const beneficiariesService = require("./service");
const { sendSuccessResponse } = require("../../utils/apiResponse");

async function listMyBeneficiariesHandler(request, response) {
  const beneficiaries = await beneficiariesService.listMyBeneficiaries(request.authenticatedUser.userId);
  return sendSuccessResponse(response, { message: "Beneficiaries retrieved successfully.", data: { beneficiaries } });
}

async function addBeneficiaryHandler(request, response) {
  const beneficiary = await beneficiariesService.addBeneficiary(
    request.authenticatedUser.userId,
    request.validatedBody
  );
  return sendSuccessResponse(response, {
    statusCode: 201,
    message: "Beneficiary added successfully.",
    data: { beneficiary },
  });
}

async function removeBeneficiaryHandler(request, response) {
  await beneficiariesService.removeBeneficiary(request.authenticatedUser.userId, request.params.beneficiaryId);
  return sendSuccessResponse(response, { message: "Beneficiary removed successfully." });
}

module.exports = {
  listMyBeneficiariesHandler,
  addBeneficiaryHandler,
  removeBeneficiaryHandler,
};
