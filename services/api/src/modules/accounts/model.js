const prismaClient = require("../../config/prismaClient");

async function createAccount({ userId, accountNumber, accountType, openingBalance = 0 }) {
  return prismaClient.account.create({
    data: {
      userId,
      accountNumber,
      accountType,
      balance: openingBalance,
      availableBalance: openingBalance,
    },
  });
}

async function findAccountsByUserId(userId) {
  return prismaClient.account.findMany({
    where: { userId },
    orderBy: { createdAt: "asc" },
  });
}

async function findAccountByIdForUser(accountId, userId) {
  return prismaClient.account.findFirst({
    where: { id: accountId, userId },
  });
}

async function findAccountByAccountNumber(accountNumber) {
  return prismaClient.account.findUnique({ where: { accountNumber } });
}

module.exports = {
  createAccount,
  findAccountsByUserId,
  findAccountByIdForUser,
  findAccountByAccountNumber,
};
