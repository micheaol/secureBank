const prismaClient = require("../../config/prismaClient");

async function createPendingTransfer(
  {
    reference,
    sourceAccountId,
    destinationAccountId,
    beneficiaryId,
    amount,
    fee,
    description,
    otpTokenHash,
    otpExpiresAt,
  },
  client = prismaClient
) {
  return client.transfer.create({
    data: {
      reference,
      sourceAccountId,
      destinationAccountId,
      beneficiaryId,
      amount,
      fee,
      description,
      status: "PENDING",
      otpTokenHash,
      otpExpiresAt,
    },
    include: { destinationAccount: true, beneficiary: true, sourceAccount: true },
  });
}

async function findTransferByIdForUser(transferId, userId) {
  return prismaClient.transfer.findFirst({
    where: { id: transferId, sourceAccount: { userId } },
    include: { destinationAccount: true, beneficiary: true, sourceAccount: true },
  });
}

async function incrementOtpAttempts(transferId, client = prismaClient) {
  return client.transfer.update({
    where: { id: transferId },
    data: { otpAttempts: { increment: 1 } },
  });
}

async function markTransferSuccessful(transferId, transactionId, client = prismaClient) {
  return client.transfer.update({
    where: { id: transferId },
    data: { status: "SUCCESSFUL", transactionId, otpTokenHash: null },
  });
}

async function markTransferFailed(transferId, client = prismaClient) {
  return client.transfer.update({
    where: { id: transferId },
    data: { status: "FAILED", otpTokenHash: null },
  });
}

async function findTransfersBySourceAccountIds(sourceAccountIds) {
  return prismaClient.transfer.findMany({
    where: { sourceAccountId: { in: sourceAccountIds } },
    include: { destinationAccount: true, beneficiary: true },
    orderBy: { createdAt: "desc" },
  });
}

module.exports = {
  createPendingTransfer,
  findTransferByIdForUser,
  incrementOtpAttempts,
  markTransferSuccessful,
  markTransferFailed,
  findTransfersBySourceAccountIds,
};
