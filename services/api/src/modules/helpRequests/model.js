const prismaClient = require("../../config/prismaClient");

async function createHelpRequest({ userId, labId, reason }) {
  return prismaClient.helpRequest.create({ data: { userId, labId, reason } });
}

async function findOpenHelpRequests() {
  return prismaClient.helpRequest.findMany({
    where: { status: "OPEN" },
    orderBy: { createdAt: "asc" },
    include: { user: { select: { id: true, fullName: true } }, lab: { select: { code: true, name: true } } },
  });
}

async function resolveHelpRequest(id) {
  return prismaClient.helpRequest.update({ where: { id }, data: { status: "RESOLVED", resolvedAt: new Date() } });
}

module.exports = { createHelpRequest, findOpenHelpRequests, resolveHelpRequest };
