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

/**
 * Places a hold on funds by decrementing availableBalance only - the
 * ledger balance is untouched until the transfer is confirmed. Uses a
 * conditional WHERE clause (rather than a read-then-write) so concurrent
 * transfers can never overdraw the account: the update simply matches zero
 * rows if funds are no longer sufficient.
 */
async function holdAvailableFundsIfSufficient(accountId, holdAmount, client = prismaClient) {
  const result = await client.account.updateMany({
    where: { id: accountId, availableBalance: { gte: holdAmount } },
    data: { availableBalance: { decrement: holdAmount } },
  });
  return result.count === 1;
}

async function releaseHeldFunds(accountId, holdAmount, client = prismaClient) {
  return client.account.update({
    where: { id: accountId },
    data: { availableBalance: { increment: holdAmount } },
  });
}

async function debitLedgerBalance(accountId, amount, client = prismaClient) {
  return client.account.update({
    where: { id: accountId },
    data: { balance: { decrement: amount } },
  });
}

async function creditAccountBalance(accountId, amount, client = prismaClient) {
  return client.account.update({
    where: { id: accountId },
    data: { balance: { increment: amount }, availableBalance: { increment: amount } },
  });
}

async function findAccountByIdForUserWithClient(accountId, userId, client = prismaClient) {
  return client.account.findFirst({ where: { id: accountId, userId } });
}

module.exports = {
  createAccount,
  findAccountsByUserId,
  findAccountByIdForUser,
  findAccountByAccountNumber,
  holdAvailableFundsIfSufficient,
  releaseHeldFunds,
  debitLedgerBalance,
  creditAccountBalance,
  findAccountByIdForUserWithClient,
};
