const prismaClient = require("../../config/prismaClient");

async function createEnvironment({ userId, labId, externalId, expiresAt }) {
  return prismaClient.environment.create({
    data: { userId, labId, externalId, status: "RUNNING", expiresAt },
  });
}

async function findActiveEnvironmentForUserAndLab(userId, labId) {
  return prismaClient.environment.findFirst({
    where: { userId, labId, status: "RUNNING", expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });
}

async function findEnvironmentByIdForUser(environmentId, userId) {
  return prismaClient.environment.findFirst({ where: { id: environmentId, userId } });
}

async function extendEnvironmentExpiry(environmentId, additionalMilliseconds) {
  const environment = await prismaClient.environment.findUnique({ where: { id: environmentId } });
  const newExpiresAt = new Date(Math.max(Date.now(), environment.expiresAt.getTime()) + additionalMilliseconds);
  return prismaClient.environment.update({ where: { id: environmentId }, data: { expiresAt: newExpiresAt } });
}

async function setEnvironmentStatus(environmentId, status) {
  return prismaClient.environment.update({ where: { id: environmentId }, data: { status } });
}

async function findEnvironmentById(environmentId) {
  return prismaClient.environment.findUnique({ where: { id: environmentId } });
}

async function findEnvironmentsForUser(userId) {
  return prismaClient.environment.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
}

async function findAllEnvironments() {
  return prismaClient.environment.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { fullName: true } }, lab: { select: { code: true, name: true } } },
  });
}

async function terminateAllRunningEnvironmentsForLab(labId) {
  return prismaClient.environment.updateMany({
    where: { labId, status: "RUNNING" },
    data: { status: "TERMINATED" },
  });
}

module.exports = {
  createEnvironment,
  findActiveEnvironmentForUserAndLab,
  findEnvironmentByIdForUser,
  extendEnvironmentExpiry,
  setEnvironmentStatus,
  findEnvironmentById,
  findEnvironmentsForUser,
  findAllEnvironments,
  terminateAllRunningEnvironmentsForLab,
};
