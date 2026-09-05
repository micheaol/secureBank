const { sendErrorResponse, ApplicationError } = require("../utils/apiResponse");
const environment = require("../config/environment");

function handleRouteNotFound(request, response) {
  return sendErrorResponse(response, {
    statusCode: 404,
    message: `Route not found: ${request.method} ${request.originalUrl}`,
  });
}

// eslint-disable-next-line no-unused-vars
function handleApplicationErrors(error, request, response, next) {
  if (error instanceof ApplicationError) {
    return sendErrorResponse(response, {
      statusCode: error.statusCode,
      message: error.message,
      errors: error.errors,
    });
  }

  console.error("Unhandled application error:", error);

  return sendErrorResponse(response, {
    statusCode: 500,
    message: "An unexpected error occurred while processing your request.",
    errors: environment.nodeEnvironment === "production" ? null : { stack: error.stack },
  });
}

module.exports = {
  handleRouteNotFound,
  handleApplicationErrors,
};
