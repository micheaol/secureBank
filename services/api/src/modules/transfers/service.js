const prismaClient = require("../../config/prismaClient");
const transfersModel = require("./model");
const accountsModel = require("../accounts/model");
const beneficiariesModel = require("../beneficiaries/model");
const transactionsModel = require("../transactions/model");
const auditService = require("../audit/service");
const { generateTransactionReference } = require("../../utils/referenceGenerator");
const { generateNumericOneTimePasscode, hashOpaqueToken } = require("../../utils/tokenService");
const { ApplicationError } = require("../../utils/apiResponse");

const SIMULATED_EXTERNAL_TRANSFER_FEE = 26.88;
const INTERNAL_TRANSFER_FEE = 0;
const OTP_EXPIRY_MINUTES = 4;
const MAX_OTP_ATTEMPTS = 5;

function buildDestinationSummary(transfer) {
  if (transfer.destinationAccount) {
    return {
      type: "account",
      accountNumber: transfer.destinationAccount.accountNumber,
      accountType: transfer.destinationAccount.accountType,
    };
  }
  return {
    type: "beneficiary",
    accountName: transfer.beneficiary.accountName,
    accountNumber: transfer.beneficiary.accountNumber,
    bankName: transfer.beneficiary.bankName,
  };
}

function buildTransferSummary(transfer) {
  return {
    id: transfer.id,
    reference: transfer.reference,
    status: transfer.status,
    amount: transfer.amount,
    fee: transfer.fee,
    description: transfer.description,
    destination: buildDestinationSummary(transfer),
    otpExpiresAt: transfer.otpExpiresAt,
  };
}

async function initiateTransfer(userId, { sourceAccountId, destinationAccountId, beneficiaryId, amount, description }, requestContext) {
  const sourceAccount = await accountsModel.findAccountByIdForUser(sourceAccountId, userId);
  if (!sourceAccount || sourceAccount.status !== "ACTIVE") {
    throw new ApplicationError("Source account not found or unavailable.", 404);
  }

  let fee = INTERNAL_TRANSFER_FEE;

  if (destinationAccountId) {
    if (destinationAccountId === sourceAccountId) {
      throw new ApplicationError("Choose a different destination account.", 422);
    }
    const destinationAccount = await accountsModel.findAccountByIdForUser(destinationAccountId, userId);
    if (!destinationAccount || destinationAccount.status !== "ACTIVE") {
      throw new ApplicationError("Destination account not found.", 404);
    }
  } else {
    const beneficiary = await beneficiariesModel.findBeneficiaryByIdForUser(beneficiaryId, userId);
    if (!beneficiary) {
      throw new ApplicationError("Beneficiary not found.", 404);
    }
    fee = SIMULATED_EXTERNAL_TRANSFER_FEE;
  }

  const totalHoldAmount = Number(amount) + fee;
  const holdWasPlaced = await accountsModel.holdAvailableFundsIfSufficient(sourceAccountId, totalHoldAmount);
  if (!holdWasPlaced) {
    throw new ApplicationError("Insufficient available balance for this transfer.", 422);
  }

  const { code: otpCode, codeHash: otpTokenHash } = generateNumericOneTimePasscode();
  const otpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
  const reference = generateTransactionReference();

  const pendingTransfer = await transfersModel.createPendingTransfer({
    reference,
    sourceAccountId,
    destinationAccountId: destinationAccountId ?? null,
    beneficiaryId: beneficiaryId ?? null,
    amount,
    fee,
    description,
    otpTokenHash,
    otpExpiresAt,
  });

  // Development-only: a real SMS/NIBSS OTP channel is out of scope here, so
  // the code is written to the server log instead, matching the
  // password-reset pattern.
  console.info(`[transfer-otp] code for transfer ${reference}: ${otpCode} (expires ${otpExpiresAt.toISOString()})`);

  await auditService.recordAuditEvent(null, {
    action: "transfer.initiated",
    result: "SUCCESS",
    actorId: userId,
    resourceType: "Transfer",
    resourceId: pendingTransfer.id,
    metadata: { amount, fee },
    ...requestContext,
  });

  return buildTransferSummary(pendingTransfer);
}

async function releaseFailedTransferHold(transfer) {
  const totalHoldAmount = Number(transfer.amount) + Number(transfer.fee);
  await accountsModel.releaseHeldFunds(transfer.sourceAccountId, totalHoldAmount);
  await transfersModel.markTransferFailed(transfer.id);
}

async function confirmTransfer(userId, transferId, otpCode, requestContext) {
  const transfer = await transfersModel.findTransferByIdForUser(transferId, userId);
  if (!transfer) {
    throw new ApplicationError("Transfer not found.", 404);
  }

  if (transfer.status !== "PENDING") {
    throw new ApplicationError("This transfer has already been processed.", 409);
  }

  if (transfer.otpExpiresAt < new Date()) {
    await releaseFailedTransferHold(transfer);
    throw new ApplicationError("This authorization code has expired. Please start the transfer again.", 400);
  }

  if (transfer.otpAttempts >= MAX_OTP_ATTEMPTS) {
    await releaseFailedTransferHold(transfer);
    throw new ApplicationError("Too many incorrect attempts. Please start the transfer again.", 400);
  }

  if (hashOpaqueToken(otpCode) !== transfer.otpTokenHash) {
    await transfersModel.incrementOtpAttempts(transfer.id);
    await auditService.recordAuditEvent(null, {
      action: "transfer.otp_failed",
      result: "DENIED",
      actorId: userId,
      resourceType: "Transfer",
      resourceId: transfer.id,
      ...requestContext,
    });
    throw new ApplicationError("Incorrect authorization code.", 401);
  }

  const totalDebitAmount = Number(transfer.amount) + Number(transfer.fee);

  const completedTransfer = await prismaClient.$transaction(async (transactionClient) => {
    const updatedSourceAccount = await accountsModel.debitLedgerBalance(
      transfer.sourceAccountId,
      totalDebitAmount,
      transactionClient
    );

    const debitTransaction = await transactionsModel.createTransaction(
      {
        accountId: transfer.sourceAccountId,
        reference: transfer.reference,
        type: "DEBIT",
        status: "SUCCESSFUL",
        amount: transfer.amount,
        balanceAfter: updatedSourceAccount.balance,
        description: transfer.description || `Transfer to ${buildDestinationSummary(transfer).accountNumber}`,
        category: "Transfer",
        occurredAt: new Date(),
      },
      transactionClient
    );

    if (transfer.destinationAccountId) {
      const updatedDestinationAccount = await accountsModel.creditAccountBalance(
        transfer.destinationAccountId,
        transfer.amount,
        transactionClient
      );

      await transactionsModel.createTransaction(
        {
          accountId: transfer.destinationAccountId,
          reference: `${transfer.reference}-CR`,
          type: "CREDIT",
          status: "SUCCESSFUL",
          amount: transfer.amount,
          balanceAfter: updatedDestinationAccount.balance,
          description: `Transfer from ${transfer.sourceAccount.accountNumber}`,
          category: "Transfer",
          occurredAt: new Date(),
        },
        transactionClient
      );
    }

    return transfersModel.markTransferSuccessful(transfer.id, debitTransaction.id, transactionClient);
  });

  await auditService.recordAuditEvent(null, {
    action: "transfer.confirmed",
    result: "SUCCESS",
    actorId: userId,
    resourceType: "Transfer",
    resourceId: transfer.id,
    ...requestContext,
  });

  return buildTransferSummary({ ...completedTransfer, destinationAccount: transfer.destinationAccount, beneficiary: transfer.beneficiary });
}

async function listTransfersForUser(userId) {
  const accounts = await accountsModel.findAccountsByUserId(userId);
  const accountIds = accounts.map((account) => account.id);
  const transfers = await transfersModel.findTransfersBySourceAccountIds(accountIds);
  return transfers.map(buildTransferSummary);
}

module.exports = {
  initiateTransfer,
  confirmTransfer,
  listTransfersForUser,
  SIMULATED_EXTERNAL_TRANSFER_FEE,
};
