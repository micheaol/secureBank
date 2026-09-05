const prismaClient = require("../../config/prismaClient");

// Full transaction history browsing/search/filtering is a Week 2 deliverable
// (SB-010). This module currently exposes only the data-access functions the
// data model requires.

async function createTransaction({ accountId, reference, type, status, amount, balanceAfter, description, category, channel, occurredAt }) {
  return prismaClient.transaction.create({
    data: { accountId, reference, type, status, amount, balanceAfter, description, category, channel, occurredAt },
  });
}

async function findTransactionsByAccountId(accountId, { take = 20, skip = 0 } = {}) {
  return prismaClient.transaction.findMany({
    where: { accountId },
    orderBy: { occurredAt: "desc" },
    take,
    skip,
  });
}

async function findTransactionByReference(reference) {
  return prismaClient.transaction.findUnique({ where: { reference } });
}

module.exports = {
  createTransaction,
  findTransactionsByAccountId,
  findTransactionByReference,
};
