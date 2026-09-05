function sendSuccessResponse(response, { statusCode = 200, message = "Request successful", data = null }) {
  return response.status(statusCode).json({ success: true, message, data });
}

function sendErrorResponse(response, { statusCode = 500, message = "Something went wrong", errors = null }) {
  return response.status(statusCode).json({ success: false, message, errors });
}

class ApplicationError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.name = "ApplicationError";
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

module.exports = {
  sendSuccessResponse,
  sendErrorResponse,
  ApplicationError,
};
