const transactionsService = require("./service");
const { sendSuccessResponse } = require("../../utils/apiResponse");

function clampPageSize(rawPageSize) {
  const parsed = Number(rawPageSize) || 20;
  return Math.min(Math.max(parsed, 1), 100);
}

async function listMyTransactionsHandler(request, response) {
  const { accountId, type, status, search, page } = request.query;

  const result = await transactionsService.listTransactionsForCurrentUser(request.authenticatedUser.userId, {
    accountId,
    type,
    status,
    searchText: search,
    page: Math.max(Number(page) || 1, 1),
    pageSize: clampPageSize(request.query.pageSize),
  });

  return sendSuccessResponse(response, { message: "Transactions retrieved successfully.", data: result });
}

async function getMyTransactionByIdHandler(request, response) {
  const transaction = await transactionsService.getTransactionDetailForCurrentUser(
    request.authenticatedUser.userId,
    request.params.transactionId
  );
  return sendSuccessResponse(response, { message: "Transaction retrieved successfully.", data: { transaction } });
}

module.exports = {
  listMyTransactionsHandler,
  getMyTransactionByIdHandler,
};
