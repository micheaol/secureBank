const prismaClient = require("../../config/prismaClient");

async function createTransaction(
  { accountId, reference, type, status, amount, balanceAfter, description, category, channel, occurredAt },
  client = prismaClient
) {
  return client.transaction.create({
    data: { accountId, reference, type, status, amount, balanceAfter, description, category, channel, occurredAt },
  });
}

function buildTransactionFilterWhereClause(accountIds, { type, status, searchText } = {}) {
  const whereClause = { accountId: Array.isArray(accountIds) ? { in: accountIds } : accountIds };

  if (type) {
    whereClause.type = type;
  }
  if (status) {
    whereClause.status = status;
  }
  if (searchText) {
    whereClause.OR = [
      { description: { contains: searchText, mode: "insensitive" } },
      { reference: { contains: searchText, mode: "insensitive" } },
      { category: { contains: searchText, mode: "insensitive" } },
    ];
  }

  return whereClause;
}

async function findTransactionsByAccountIds(accountIds, { take = 20, skip = 0, type, status, searchText } = {}) {
  return prismaClient.transaction.findMany({
    where: buildTransactionFilterWhereClause(accountIds, { type, status, searchText }),
    orderBy: { occurredAt: "desc" },
    take,
    skip,
  });
}

async function countTransactionsByAccountIds(accountIds, { type, status, searchText } = {}) {
  return prismaClient.transaction.count({
    where: buildTransactionFilterWhereClause(accountIds, { type, status, searchText }),
  });
}

async function findTransactionByIdForAccounts(transactionId, accountIds) {
  return prismaClient.transaction.findFirst({
    where: { id: transactionId, accountId: { in: accountIds } },
    include: { account: true },
  });
}

async function findTransactionByReference(reference) {
  return prismaClient.transaction.findUnique({ where: { reference } });
}

module.exports = {
  createTransaction,
  findTransactionsByAccountIds,
  countTransactionsByAccountIds,
  findTransactionByIdForAccounts,
  findTransactionByReference,
};
