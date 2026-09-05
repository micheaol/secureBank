const auditModel = require("./model");

function extractRequestContext(request) {
  return {
    ipAddress: request?.ip,
    userAgent: request?.headers?.["user-agent"],
    correlationId: request?.headers?.["x-correlation-id"],
  };
}

async function recordAuditEvent(request, { action, result, actorId, actorRole, resourceType, resourceId, metadata }) {
  const requestContext = extractRequestContext(request);

  try {
    await auditModel.createAuditEvent({
      actorId: actorId ?? request?.authenticatedUser?.userId ?? null,
      actorRole: actorRole ?? request?.authenticatedUser?.roleName ?? null,
      action,
      resourceType,
      resourceId,
      result,
      metadata,
      ...requestContext,
    });
  } catch (auditWriteError) {
    console.error("Failed to record audit event:", action, auditWriteError);
  }
}

async function listRecentAuditEvents(take) {
  return auditModel.findRecentAuditEvents({ take });
}

module.exports = {
  recordAuditEvent,
  listRecentAuditEvents,
};
