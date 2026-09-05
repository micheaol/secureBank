const prismaClient = require("../../config/prismaClient");

// Full beneficiary management (create/list/view/delete) is a Week 2 deliverable
// (SB-008). This module currently exposes only the data-access functions the
// data model requires; the router/controller/service are added alongside the
// Beneficiary Management feature.

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

module.exports = {
  createBeneficiary,
  findBeneficiariesByUserId,
  findBeneficiaryByIdForUser,
};
