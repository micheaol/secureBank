const transactionsModel = require("./model");
const accountsModel = require("../accounts/model");
const { ApplicationError } = require("../../utils/apiResponse");

async function listTransactionsForCurrentUser(userId, { accountId, type, status, searchText, page = 1, pageSize = 20 }) {
  const ownedAccounts = await accountsModel.findAccountsByUserId(userId);
  const ownedAccountIds = ownedAccounts.map((account) => account.id);

  let targetAccountIds = ownedAccountIds;
  if (accountId) {
    if (!ownedAccountIds.includes(accountId)) {
      throw new ApplicationError("Account not found.", 404);
    }
    targetAccountIds = [accountId];
  }

  const skip = (page - 1) * pageSize;
  const [transactions, totalCount] = await Promise.all([
    transactionsModel.findTransactionsByAccountIds(targetAccountIds, { take: pageSize, skip, type, status, searchText }),
    transactionsModel.countTransactionsByAccountIds(targetAccountIds, { type, status, searchText }),
  ]);

  return { transactions, totalCount, page, pageSize };
}

async function getTransactionDetailForCurrentUser(userId, transactionId) {
  const ownedAccounts = await accountsModel.findAccountsByUserId(userId);
  const ownedAccountIds = ownedAccounts.map((account) => account.id);

  const transaction = await transactionsModel.findTransactionByIdForAccounts(transactionId, ownedAccountIds);
  if (!transaction) {
    throw new ApplicationError("Transaction not found.", 404);
  }

  return transaction;
}

module.exports = {
  listTransactionsForCurrentUser,
  getTransactionDetailForCurrentUser,
};
