const adminService = require("./service");
const { sendSuccessResponse } = require("../../utils/apiResponse");

function extractActor(request) {
  return [request.authenticatedUser.userId, request.authenticatedUser.roleName];
}

async function getOverviewHandler(request, response) {
  const overview = await adminService.getOverview();
  return sendSuccessResponse(response, { message: "Overview retrieved successfully.", data: overview });
}

async function listEnvironmentsHandler(request, response) {
  const environments = await adminService.listEnvironments();
  return sendSuccessResponse(response, { message: "Environments retrieved successfully.", data: { environments } });
}

async function terminateEnvironmentHandler(request, response) {
  const [actorId, actorRoleName] = extractActor(request);
  const environment = await adminService.terminateEnvironment(request.params.environmentId, actorId, actorRoleName);
  return sendSuccessResponse(response, { message: "Environment terminated.", data: { environment } });
}

async function listAuditLogHandler(request, response) {
  const auditLog = await adminService.listAuditLog(Number(request.query.limit) || 50);
  return sendSuccessResponse(response, { message: "Audit log retrieved successfully.", data: { auditLog } });
}

async function getEmergencyStatusHandler(request, response) {
  const status = await adminService.getEmergencyStatus();
  return sendSuccessResponse(response, { message: "Emergency status retrieved successfully.", data: status });
}

async function stopProvisioningHandler(request, response) {
  const [actorId, actorRoleName] = extractActor(request);
  await adminService.setProvisioningStopped(true, request.validatedBody.reason, actorId, actorRoleName);
  return sendSuccessResponse(response, { message: "New provisioning stopped." });
}

async function resumeProvisioningHandler(request, response) {
  const [actorId, actorRoleName] = extractActor(request);
  await adminService.setProvisioningStopped(false, request.validatedBody.reason, actorId, actorRoleName);
  return sendSuccessResponse(response, { message: "Provisioning resumed." });
}

async function disableLabHandler(request, response) {
  const [actorId, actorRoleName] = extractActor(request);
  await adminService.setLabDisabled(request.params.labCode, true, request.validatedBody.reason, actorId, actorRoleName);
  return sendSuccessResponse(response, { message: "Lab disabled." });
}

async function enableLabHandler(request, response) {
  const [actorId, actorRoleName] = extractActor(request);
  await adminService.setLabDisabled(request.params.labCode, false, request.validatedBody.reason, actorId, actorRoleName);
  return sendSuccessResponse(response, { message: "Lab enabled." });
}

async function terminateAllEnvironmentsForLabHandler(request, response) {
  const [actorId, actorRoleName] = extractActor(request);
  const result = await adminService.terminateAllEnvironmentsForLab(
    request.params.labCode,
    request.validatedBody.reason,
    actorId,
    actorRoleName
  );
  return sendSuccessResponse(response, { message: "Environments terminated for lab.", data: result });
}

async function emergencyShutdownHandler(request, response) {
  const [actorId, actorRoleName] = extractActor(request);
  await adminService.setEmergencyShutdown(true, request.validatedBody.reason, actorId, actorRoleName);
  return sendSuccessResponse(response, { message: "Emergency shutdown activated." });
}

async function liftEmergencyShutdownHandler(request, response) {
  const [actorId, actorRoleName] = extractActor(request);
  await adminService.setEmergencyShutdown(false, request.validatedBody.reason, actorId, actorRoleName);
  return sendSuccessResponse(response, { message: "Emergency shutdown lifted." });
}

module.exports = {
  getOverviewHandler,
  listEnvironmentsHandler,
  terminateEnvironmentHandler,
  listAuditLogHandler,
  getEmergencyStatusHandler,
  stopProvisioningHandler,
  resumeProvisioningHandler,
  disableLabHandler,
  enableLabHandler,
  terminateAllEnvironmentsForLabHandler,
  emergencyShutdownHandler,
  liftEmergencyShutdownHandler,
};
