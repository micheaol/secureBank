const beneficiariesModel = require("./model");
const { ApplicationError } = require("../../utils/apiResponse");

async function listMyBeneficiaries(userId) {
  return beneficiariesModel.findBeneficiariesByUserId(userId);
}

async function addBeneficiary(userId, beneficiaryDetails) {
  return beneficiariesModel.createBeneficiary({ userId, ...beneficiaryDetails });
}

async function removeBeneficiary(userId, beneficiaryId) {
  const result = await beneficiariesModel.deleteBeneficiaryForUser(beneficiaryId, userId);
  if (result.count === 0) {
    throw new ApplicationError("Beneficiary not found.", 404);
  }
}

module.exports = {
  listMyBeneficiaries,
  addBeneficiary,
  removeBeneficiary,
};
