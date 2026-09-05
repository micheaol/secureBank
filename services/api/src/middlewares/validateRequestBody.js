const { sendErrorResponse } = require("../utils/apiResponse");

function validateRequestBody(zodSchema) {
  return function validateRequestBodyMiddleware(request, response, next) {
    const validationResult = zodSchema.safeParse(request.body);

    if (!validationResult.success) {
      const fieldErrors = validationResult.error.flatten().fieldErrors;
      return sendErrorResponse(response, {
        statusCode: 422,
        message: "Validation failed for one or more fields.",
        errors: fieldErrors,
      });
    }

    request.validatedBody = validationResult.data;
    return next();
  };
}

module.exports = validateRequestBody;
