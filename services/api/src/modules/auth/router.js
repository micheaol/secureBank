const express = require("express");
const authController = require("./controller");
const validateRequestBody = require("../../middlewares/validateRequestBody");
const { authenticationRateLimiter } = require("../../middlewares/rateLimiters");
const asyncRouteHandler = require("../../utils/asyncRouteHandler");
const {
  registerRequestSchema,
  loginRequestSchema,
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
} = require("../../validators/authValidators");

const authRouter = express.Router();

authRouter.post(
  "/register",
  authenticationRateLimiter,
  validateRequestBody(registerRequestSchema),
  asyncRouteHandler(authController.registerHandler)
);

authRouter.post(
  "/login",
  authenticationRateLimiter,
  validateRequestBody(loginRequestSchema),
  asyncRouteHandler(authController.loginHandler)
);

authRouter.post("/refresh", asyncRouteHandler(authController.refreshHandler));

authRouter.post("/logout", asyncRouteHandler(authController.logoutHandler));

authRouter.post(
  "/forgot-password",
  authenticationRateLimiter,
  validateRequestBody(forgotPasswordRequestSchema),
  asyncRouteHandler(authController.forgotPasswordHandler)
);

authRouter.post(
  "/reset-password",
  authenticationRateLimiter,
  validateRequestBody(resetPasswordRequestSchema),
  asyncRouteHandler(authController.resetPasswordHandler)
);

module.exports = authRouter;
