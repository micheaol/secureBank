const { sendErrorResponse } = require("../utils/apiResponse");

function authorizeRoles(...allowedRoleNames) {
  return function authorizeRolesMiddleware(request, response, next) {
    const currentUserRole = request.authenticatedUser?.roleName;

    if (!currentUserRole || !allowedRoleNames.includes(currentUserRole)) {
      return sendErrorResponse(response, {
        statusCode: 403,
        message: "You do not have permission to perform this action.",
      });
    }

    return next();
  };
}

module.exports = authorizeRoles;
