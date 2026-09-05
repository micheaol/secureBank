const accountsModel = require("./model");
const { generateSyntheticAccountNumber } = require("../../utils/referenceGenerator");
const { ApplicationError } = require("../../utils/apiResponse");

const MAX_ACCOUNT_NUMBER_GENERATION_ATTEMPTS = 5;

async function generateUniqueAccountNumber() {
  for (let attempt = 0; attempt < MAX_ACCOUNT_NUMBER_GENERATION_ATTEMPTS; attempt += 1) {
    const candidateAccountNumber = generateSyntheticAccountNumber();
    const existingAccount = await accountsModel.findAccountByAccountNumber(candidateAccountNumber);
    if (!existingAccount) {
      return candidateAccountNumber;
    }
  }
  throw new ApplicationError("Could not generate a unique account number. Please try again.", 500);
}

async function provisionDefaultAccountsForNewUser(userId) {
  const currentAccountNumber = await generateUniqueAccountNumber();
  const currentAccount = await accountsModel.createAccount({
    userId,
    accountNumber: currentAccountNumber,
    accountType: "CURRENT",
    openingBalance: 0,
  });

  const savingsAccountNumber = await generateUniqueAccountNumber();
  const savingsAccount = await accountsModel.createAccount({
    userId,
    accountNumber: savingsAccountNumber,
    accountType: "SAVINGS",
    openingBalance: 0,
  });

  return [currentAccount, savingsAccount];
}

async function listAccountsForCurrentUser(userId) {
  return accountsModel.findAccountsByUserId(userId);
}

async function getAccountForCurrentUser(userId, accountId) {
  const account = await accountsModel.findAccountByIdForUser(accountId, userId);

  if (!account) {
    throw new ApplicationError("Account not found.", 404);
  }

  return account;
}

module.exports = {
  provisionDefaultAccountsForNewUser,
  listAccountsForCurrentUser,
  getAccountForCurrentUser,
};
