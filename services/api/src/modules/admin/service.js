const prismaClient = require("../../config/prismaClient");
const environmentsModel = require("../environments/model");
const environmentsService = require("../environments/service");
const auditService = require("../audit/service");
const labsModel = require("../labs/model");
const systemFlagsService = require("../systemFlags/service");
const { ApplicationError } = require("../../utils/apiResponse");

async function getOverview() {
  const [registeredParticipants, runningEnvironments, totalAttempts, totalSolved] = await Promise.all([
    prismaClient.user.count({ where: { role: { name: "customer" } } }),
    prismaClient.environment.count({ where: { status: "RUNNING" } }),
    prismaClient.challengeProgress.aggregate({ _sum: { attempts: true } }),
    prismaClient.challengeProgress.count({ where: { status: "SOLVED" } }),
  ]);

  const totalAttemptCount = totalAttempts._sum.attempts ?? 0;
  const validationHealthPercent = totalAttemptCount === 0 ? 100 : Math.round((totalSolved / totalAttemptCount) * 100);

  return {
    registeredParticipants,
    runningEnvironments,
    validationHealthPercent,
  };
}

async function listEnvironments() {
  const environments = await environmentsModel.findAllEnvironments();
  return environments.map((environment) => ({
    id: environment.id,
    externalId: environment.externalId,
    participant: environment.user.fullName,
    lab: environment.lab.name,
    status: environment.status,
    createdAt: environment.createdAt,
    expiresAt: environment.expiresAt,
  }));
}

async function terminateEnvironment(environmentId, actorId, actorRoleName) {
  const environment = await environmentsService.privilegedTerminateEnvironment(environmentId);

  await auditService.recordAuditEvent(null, {
    action: "admin.environment_terminated",
    result: "SUCCESS",
    actorId,
    actorRole: actorRoleName,
    resourceType: "Environment",
    resourceId: environmentId,
  });

  return environment;
}

async function listAuditLog(limit) {
  const events = await auditService.listRecentAuditEvents(limit);
  return events.map((event) => ({
    id: event.id,
    timestamp: event.createdAt,
    actor: event.actor?.fullName ?? "system",
    action: event.action,
    resource: event.resourceType ? `${event.resourceType}:${event.resourceId ?? ""}` : null,
    result: event.result,
    correlationId: event.correlationId,
  }));
}

async function getEmergencyStatus() {
  const [flags, labs] = await Promise.all([systemFlagsService.listAllFlags(), labsModel.findAllLabs()]);
  const flagsByKey = new Map(flags.map((flag) => [flag.key, flag]));

  return {
    provisioningStopped: Boolean(flagsByKey.get(systemFlagsService.PROVISIONING_STOPPED_KEY)?.value),
    emergencyShutdownActive: Boolean(flagsByKey.get(systemFlagsService.EMERGENCY_SHUTDOWN_KEY)?.value),
    labs: labs.map((lab) => ({
      code: lab.code,
      name: lab.name,
      disabled: Boolean(flagsByKey.get(systemFlagsService.labDisabledKey(lab.code))?.value),
    })),
  };
}

async function setProvisioningStopped(value, reason, actorId, actorRoleName) {
  return systemFlagsService.setEmergencyFlag(systemFlagsService.PROVISIONING_STOPPED_KEY, value, reason, actorId, actorRoleName);
}

async function setLabDisabled(labCode, value, reason, actorId, actorRoleName) {
  const lab = await labsModel.findLabByCode(labCode);
  if (!lab) {
    throw new ApplicationError("Lab not found.", 404);
  }
  return systemFlagsService.setEmergencyFlag(systemFlagsService.labDisabledKey(labCode), value, reason, actorId, actorRoleName);
}

async function terminateAllEnvironmentsForLab(labCode, reason, actorId, actorRoleName) {
  const lab = await labsModel.findLabByCode(labCode);
  if (!lab) {
    throw new ApplicationError("Lab not found.", 404);
  }
  const result = await environmentsModel.terminateAllRunningEnvironmentsForLab(lab.id);

  await auditService.recordAuditEvent(null, {
    action: "emergency.terminate_all_environments_for_lab",
    result: "SUCCESS",
    actorId,
    actorRole: actorRoleName,
    resourceType: "Lab",
    resourceId: lab.id,
    metadata: { reason, terminatedCount: result.count },
  });

  return { terminatedCount: result.count };
}

async function setEmergencyShutdown(value, reason, actorId, actorRoleName) {
  return systemFlagsService.setEmergencyFlag(systemFlagsService.EMERGENCY_SHUTDOWN_KEY, value, reason, actorId, actorRoleName);
}

module.exports = {
  getOverview,
  listEnvironments,
  terminateEnvironment,
  listAuditLog,
  getEmergencyStatus,
  setProvisioningStopped,
  setLabDisabled,
  terminateAllEnvironmentsForLab,
  setEmergencyShutdown,
};
