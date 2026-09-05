const accountsService = require("./service");
const { sendSuccessResponse } = require("../../utils/apiResponse");

async function listMyAccountsHandler(request, response) {
  const accounts = await accountsService.listAccountsForCurrentUser(
    request.authenticatedUser.userId
  );

  return sendSuccessResponse(response, {
    message: "Accounts retrieved successfully.",
    data: { accounts },
  });
}

async function getMyAccountByIdHandler(request, response) {
  const account = await accountsService.getAccountForCurrentUser(
    request.authenticatedUser.userId,
    request.params.accountId
  );

  return sendSuccessResponse(response, {
    message: "Account retrieved successfully.",
    data: { account },
  });
}

module.exports = {
  listMyAccountsHandler,
  getMyAccountByIdHandler,
};
