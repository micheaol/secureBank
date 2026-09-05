const authService = require("./service");
const { sendSuccessResponse } = require("../../utils/apiResponse");

function extractRequestContext(request) {
  return {
    ipAddress: request.ip,
    userAgent: request.headers["user-agent"],
  };
}

async function registerHandler(request, response) {
  const result = await authService.registerNewCustomer(
    request.validatedBody,
    extractRequestContext(request)
  );

  return sendSuccessResponse(response, {
    statusCode: 201,
    message: "Account created successfully.",
    data: result,
  });
}

async function loginHandler(request, response) {
  const result = await authService.authenticateUserCredentials(
    request.validatedBody,
    extractRequestContext(request)
  );

  return sendSuccessResponse(response, {
    message: "Signed in successfully.",
    data: result,
  });
}

async function refreshHandler(request, response) {
  const result = await authService.rotateRefreshToken(
    request.body?.refreshToken,
    extractRequestContext(request)
  );

  return sendSuccessResponse(response, {
    message: "Session refreshed successfully.",
    data: result,
  });
}

async function logoutHandler(request, response) {
  await authService.logoutUser(request.body?.refreshToken);

  return sendSuccessResponse(response, {
    message: "Signed out successfully.",
  });
}

async function forgotPasswordHandler(request, response) {
  const result = await authService.requestPasswordReset(
    request.validatedBody,
    extractRequestContext(request)
  );

  return sendSuccessResponse(response, { message: result.message });
}

async function resetPasswordHandler(request, response) {
  const result = await authService.resetPasswordWithToken(
    request.validatedBody,
    extractRequestContext(request)
  );

  return sendSuccessResponse(response, { message: result.message });
}

module.exports = {
  registerHandler,
  loginHandler,
  refreshHandler,
  logoutHandler,
  forgotPasswordHandler,
  resetPasswordHandler,
};
