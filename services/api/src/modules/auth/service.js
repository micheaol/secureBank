const authModel = require("./model");
const usersModel = require("../users/model");
const accountsService = require("../accounts/service");
const auditService = require("../audit/service");
const { hashPlainTextPassword, verifyPasswordAgainstHash } = require("../../utils/passwordHasher");
const { signAccessToken, generateOpaqueSessionToken, hashOpaqueToken } = require("../../utils/tokenService");
const { ApplicationError } = require("../../utils/apiResponse");
const environment = require("../../config/environment");

const DEFAULT_SELF_REGISTRATION_ROLE_NAME = "customer";

function buildAccessTokenPayload(user) {
  return { userId: user.id, email: user.email, roleName: user.role.name };
}

function buildPublicUserProfile(user) {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    phoneNumber: user.phoneNumber,
    role: user.role.name,
  };
}

function calculateExpiryDateFromNow(millisecondsFromNow) {
  return new Date(Date.now() + millisecondsFromNow);
}

async function issueTokenPairForUser(user, requestContext) {
  const accessToken = signAccessToken(buildAccessTokenPayload(user));

  const { rawToken: refreshToken, tokenHash: refreshTokenHash } = generateOpaqueSessionToken();
  const refreshTokenExpiresAt = calculateExpiryDateFromNow(
    environment.jsonWebToken.refreshTokenExpiresInDays * 24 * 60 * 60 * 1000
  );

  await authModel.createRefreshToken({
    userId: user.id,
    tokenHash: refreshTokenHash,
    expiresAt: refreshTokenExpiresAt,
    userAgent: requestContext?.userAgent ?? null,
    ipAddress: requestContext?.ipAddress ?? null,
  });

  return { accessToken, refreshToken };
}

async function registerNewCustomer({ fullName, email, phoneNumber, password }, requestContext) {
  const existingUser = await usersModel.findUserByEmail(email);
  if (existingUser) {
    throw new ApplicationError("An account with this email address already exists.", 409);
  }

  const customerRole = await usersModel.findRoleByName(DEFAULT_SELF_REGISTRATION_ROLE_NAME);
  if (!customerRole) {
    throw new ApplicationError(
      "Registration is temporarily unavailable. Please contact support.",
      500
    );
  }

  const passwordHash = await hashPlainTextPassword(password);

  const newUser = await usersModel.createUser({
    fullName,
    email,
    phoneNumber,
    passwordHash,
    roleId: customerRole.id,
  });

  await accountsService.provisionDefaultAccountsForNewUser(newUser.id);

  const tokenPair = await issueTokenPairForUser(newUser, requestContext);

  await auditService.recordAuditEvent(null, {
    action: "auth.register",
    result: "SUCCESS",
    actorId: newUser.id,
    actorRole: newUser.role.name,
    resourceType: "User",
    resourceId: newUser.id,
    ...requestContext,
  });

  return { user: buildPublicUserProfile(newUser), ...tokenPair };
}

async function authenticateUserCredentials({ email, password }, requestContext) {
  const genericInvalidCredentialsMessage = "Invalid email or password.";
  const user = await usersModel.findUserByEmail(email);

  if (!user || !user.isActive) {
    await auditService.recordAuditEvent(null, {
      action: "auth.login",
      result: "DENIED",
      actorRole: "unknown",
      metadata: { email },
      ...requestContext,
    });
    throw new ApplicationError(genericInvalidCredentialsMessage, 401);
  }

  const isPasswordValid = await verifyPasswordAgainstHash(password, user.passwordHash);
  if (!isPasswordValid) {
    await auditService.recordAuditEvent(null, {
      action: "auth.login",
      result: "DENIED",
      actorId: user.id,
      actorRole: user.role.name,
      ...requestContext,
    });
    throw new ApplicationError(genericInvalidCredentialsMessage, 401);
  }

  await usersModel.updateLastLoginTimestamp(user.id);
  const tokenPair = await issueTokenPairForUser(user, requestContext);

  await auditService.recordAuditEvent(null, {
    action: "auth.login",
    result: "SUCCESS",
    actorId: user.id,
    actorRole: user.role.name,
    ...requestContext,
  });

  return { user: buildPublicUserProfile(user), ...tokenPair };
}

async function rotateRefreshToken(providedRefreshToken, requestContext) {
  const invalidSessionMessage = "Your session has expired. Please sign in again.";

  if (!providedRefreshToken) {
    throw new ApplicationError(invalidSessionMessage, 401);
  }

  const tokenHash = hashOpaqueToken(providedRefreshToken);
  const existingRefreshToken = await authModel.findActiveRefreshTokenByHash(tokenHash);

  if (!existingRefreshToken) {
    throw new ApplicationError(invalidSessionMessage, 401);
  }

  await authModel.revokeRefreshTokenByHash(tokenHash);

  const tokenPair = await issueTokenPairForUser(existingRefreshToken.user, requestContext);

  return { user: buildPublicUserProfile(existingRefreshToken.user), ...tokenPair };
}

async function logoutUser(providedRefreshToken) {
  if (!providedRefreshToken) {
    return;
  }
  const tokenHash = hashOpaqueToken(providedRefreshToken);
  await authModel.revokeRefreshTokenByHash(tokenHash);
}

async function requestPasswordReset({ email }, requestContext) {
  const user = await usersModel.findUserByEmail(email);

  if (user) {
    const { rawToken, tokenHash } = generateOpaqueSessionToken();
    const expiresAt = calculateExpiryDateFromNow(
      environment.passwordReset.tokenExpiresInMinutes * 60 * 1000
    );

    await authModel.createPasswordResetToken({ userId: user.id, tokenHash, expiresAt });

    // Development-only: an outbound email service is out of scope for Week 1,
    // so the reset link is written to the server log rather than sent to the
    // caller (returning it in the response would allow account takeover).
    console.info(
      `[password-reset] token for ${user.email}: ${rawToken} (expires ${expiresAt.toISOString()})`
    );

    await auditService.recordAuditEvent(null, {
      action: "auth.password_reset_requested",
      result: "SUCCESS",
      actorId: user.id,
      actorRole: user.role.name,
      ...requestContext,
    });
  }

  // The response is identical whether or not the email is registered, so a
  // caller cannot use this endpoint to enumerate valid accounts.
  return {
    message: "If that email address is registered, password reset instructions have been sent.",
  };
}

async function resetPasswordWithToken({ resetToken, newPassword }, requestContext) {
  const invalidTokenMessage = "This password reset link is invalid or has expired.";
  const tokenHash = hashOpaqueToken(resetToken);
  const passwordResetRecord = await authModel.findValidPasswordResetTokenByHash(tokenHash);

  if (!passwordResetRecord) {
    throw new ApplicationError(invalidTokenMessage, 400);
  }

  const newPasswordHash = await hashPlainTextPassword(newPassword);
  await usersModel.updateUserPasswordHash(passwordResetRecord.userId, newPasswordHash);
  await authModel.markPasswordResetTokenAsUsed(passwordResetRecord.id);
  await authModel.revokeAllRefreshTokensForUser(passwordResetRecord.userId);

  await auditService.recordAuditEvent(null, {
    action: "auth.password_reset_completed",
    result: "SUCCESS",
    actorId: passwordResetRecord.userId,
    ...requestContext,
  });

  return { message: "Your password has been reset. Please sign in with your new password." };
}

module.exports = {
  registerNewCustomer,
  authenticateUserCredentials,
  rotateRefreshToken,
  logoutUser,
  requestPasswordReset,
  resetPasswordWithToken,
  buildPublicUserProfile,
};
