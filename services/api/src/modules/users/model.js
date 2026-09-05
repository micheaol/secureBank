const prismaClient = require("../../config/prismaClient");

const publicUserSelectFields = {
  id: true,
  fullName: true,
  email: true,
  phoneNumber: true,
  isActive: true,
  isTwoFactorEnabled: true,
  lastLoginAt: true,
  createdAt: true,
  role: { select: { id: true, name: true } },
};

async function findRoleByName(roleName) {
  return prismaClient.role.findUnique({ where: { name: roleName } });
}

async function findUserByEmail(email) {
  return prismaClient.user.findUnique({
    where: { email },
    include: { role: true },
  });
}

async function findUserById(userId) {
  return prismaClient.user.findUnique({
    where: { id: userId },
    select: publicUserSelectFields,
  });
}

async function createUser({ fullName, email, passwordHash, phoneNumber, roleId }) {
  return prismaClient.user.create({
    data: { fullName, email, passwordHash, phoneNumber, roleId },
    include: { role: true },
  });
}

async function updateLastLoginTimestamp(userId) {
  return prismaClient.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });
}

async function updateUserPasswordHash(userId, passwordHash) {
  return prismaClient.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
}

module.exports = {
  publicUserSelectFields,
  findRoleByName,
  findUserByEmail,
  findUserById,
  createUser,
  updateLastLoginTimestamp,
  updateUserPasswordHash,
};
