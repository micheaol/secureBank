const prismaClient = require("../../config/prismaClient");

// Full transfer workflow (recipient -> amount -> review -> authorize -> success)
// is a Week 2 deliverable (SB-009). This module currently exposes only the
// data-access functions the data model requires.

async function createTransfer({ reference, sourceAccountId, destinationAccountId, beneficiaryId, amount, fee, description, status, transactionId }) {
  return prismaClient.transfer.create({
    data: { reference, sourceAccountId, destinationAccountId, beneficiaryId, amount, fee, description, status, transactionId },
  });
}

async function findTransfersBySourceAccountId(sourceAccountId) {
  return prismaClient.transfer.findMany({
    where: { sourceAccountId },
    orderBy: { createdAt: "desc" },
  });
}

async function findTransferByReference(reference) {
  return prismaClient.transfer.findUnique({ where: { reference } });
}

module.exports = {
  createTransfer,
  findTransfersBySourceAccountId,
  findTransferByReference,
};
