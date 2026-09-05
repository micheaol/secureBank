const { verifyAccessToken } = require("../utils/tokenService");
const { sendErrorResponse } = require("../utils/apiResponse");

function extractBearerToken(request) {
  const authorizationHeader = request.headers.authorization || "";
  const [scheme, token] = authorizationHeader.split(" ");
  return scheme === "Bearer" ? token : null;
}

function authenticateRequest(request, response, next) {
  const accessToken = extractBearerToken(request);

  if (!accessToken) {
    return sendErrorResponse(response, {
      statusCode: 401,
      message: "Authentication required. No access token was provided.",
    });
  }

  try {
    const tokenPayload = verifyAccessToken(accessToken);
    request.authenticatedUser = {
      userId: tokenPayload.userId,
      email: tokenPayload.email,
      roleName: tokenPayload.roleName,
    };
    return next();
  } catch (tokenVerificationError) {
    return sendErrorResponse(response, {
      statusCode: 401,
      message: "Your session has expired or the access token is invalid.",
    });
  }
}

module.exports = authenticateRequest;
