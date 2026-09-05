const prismaClient = require("../../config/prismaClient");

async function createRefreshToken({ userId, tokenHash, expiresAt, userAgent, ipAddress }) {
  return prismaClient.refreshToken.create({
    data: { userId, tokenHash, expiresAt, userAgent, ipAddress },
  });
}

async function findActiveRefreshTokenByHash(tokenHash) {
  return prismaClient.refreshToken.findFirst({
    where: { tokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
    include: { user: { include: { role: true } } },
  });
}

async function revokeRefreshTokenByHash(tokenHash) {
  return prismaClient.refreshToken.updateMany({
    where: { tokenHash, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

async function revokeAllRefreshTokensForUser(userId) {
  return prismaClient.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  });
}

async function createPasswordResetToken({ userId, tokenHash, expiresAt }) {
  return prismaClient.passwordResetToken.create({
    data: { userId, tokenHash, expiresAt },
  });
}

async function findValidPasswordResetTokenByHash(tokenHash) {
  return prismaClient.passwordResetToken.findFirst({
    where: { tokenHash, usedAt: null, expiresAt: { gt: new Date() } },
  });
}

async function markPasswordResetTokenAsUsed(passwordResetTokenId) {
  return prismaClient.passwordResetToken.update({
    where: { id: passwordResetTokenId },
    data: { usedAt: new Date() },
  });
}

module.exports = {
  createRefreshToken,
  findActiveRefreshTokenByHash,
  revokeRefreshTokenByHash,
  revokeAllRefreshTokensForUser,
  createPasswordResetToken,
  findValidPasswordResetTokenByHash,
  markPasswordResetTokenAsUsed,
};
