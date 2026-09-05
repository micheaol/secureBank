const prismaClient = require("../../config/prismaClient");

async function createBeneficiary({ userId, nickname, accountName, accountNumber, bankName }) {
  return prismaClient.beneficiary.create({
    data: { userId, nickname, accountName, accountNumber, bankName },
  });
}

async function findBeneficiariesByUserId(userId) {
  return prismaClient.beneficiary.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

async function findBeneficiaryByIdForUser(beneficiaryId, userId) {
  return prismaClient.beneficiary.findFirst({ where: { id: beneficiaryId, userId } });
}

async function deleteBeneficiaryForUser(beneficiaryId, userId) {
  return prismaClient.beneficiary.deleteMany({ where: { id: beneficiaryId, userId } });
}

module.exports = {
  createBeneficiary,
  findBeneficiariesByUserId,
  findBeneficiaryByIdForUser,
  deleteBeneficiaryForUser,
};
