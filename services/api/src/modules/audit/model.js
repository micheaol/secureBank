const prismaClient = require("../../config/prismaClient");

async function createAuditEvent({
  actorId = null,
  actorRole = null,
  action,
  resourceType = null,
  resourceId = null,
  result,
  ipAddress = null,
  userAgent = null,
  correlationId = null,
  metadata = null,
}) {
  return prismaClient.auditEvent.create({
    data: {
      actorId,
      actorRole,
      action,
      resourceType,
      resourceId,
      result,
      ipAddress,
      userAgent,
      correlationId,
      metadata,
    },
  });
}

async function findRecentAuditEvents({ take = 50 } = {}) {
  return prismaClient.auditEvent.findMany({
    take,
    orderBy: { createdAt: "desc" },
    include: { actor: { select: { id: true, fullName: true, email: true } } },
  });
}

module.exports = {
  createAuditEvent,
  findRecentAuditEvents,
};
