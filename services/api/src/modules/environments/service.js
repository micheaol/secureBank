const environmentsModel = require("./model");
const systemFlagsService = require("../systemFlags/service");
const { ApplicationError } = require("../../utils/apiResponse");

const ENVIRONMENT_LIFETIME_MS = 2 * 60 * 60 * 1000;
const ENVIRONMENT_EXTENSION_MS = 30 * 60 * 1000;

function generateEnvironmentExternalId() {
  const randomDigits = Math.floor(1000 + Math.random() * 9000);
  return `env-${randomDigits}`;
}

async function getOrCreateEnvironmentForLab(userId, labId, labCode) {
  const existingEnvironment = await environmentsModel.findActiveEnvironmentForUserAndLab(userId, labId);
  if (existingEnvironment) {
    return existingEnvironment;
  }

  const [provisioningStopped, labDisabled, emergencyShutdown] = await Promise.all([
    systemFlagsService.isProvisioningStopped(),
    systemFlagsService.isLabDisabled(labCode),
    systemFlagsService.isEmergencyShutdownActive(),
  ]);

  if (emergencyShutdown) {
    throw new ApplicationError("The Sandbox is under an emergency shutdown. Please wait for facilitator guidance.", 503);
  }
  if (labDisabled) {
    throw new ApplicationError("This lab is temporarily disabled by a facilitator.", 503);
  }
  if (provisioningStopped) {
    throw new ApplicationError("New environment provisioning is temporarily paused.", 503);
  }

  return environmentsModel.createEnvironment({
    userId,
    labId,
    externalId: generateEnvironmentExternalId(),
    expiresAt: new Date(Date.now() + ENVIRONMENT_LIFETIME_MS),
  });
}

async function resetEnvironment(userId, environmentId) {
  const environment = await environmentsModel.findEnvironmentByIdForUser(environmentId, userId);
  if (!environment) {
    throw new ApplicationError("Environment not found.", 404);
  }
  return environmentsModel.extendEnvironmentExpiry(environmentId, ENVIRONMENT_LIFETIME_MS);
}

async function terminateEnvironment(userId, environmentId) {
  const environment = await environmentsModel.findEnvironmentByIdForUser(environmentId, userId);
  if (!environment) {
    throw new ApplicationError("Environment not found.", 404);
  }
  return environmentsModel.setEnvironmentStatus(environmentId, "TERMINATED");
}

async function extendEnvironment(userId, environmentId) {
  const environment = await environmentsModel.findEnvironmentByIdForUser(environmentId, userId);
  if (!environment) {
    throw new ApplicationError("Environment not found.", 404);
  }
  return environmentsModel.extendEnvironmentExpiry(environmentId, ENVIRONMENT_EXTENSION_MS);
}

/**
 * Privileged variants for the Facilitator/Admin consoles: authorization is
 * enforced by role at the router (authorizeRoles), not by ownership, since
 * these act on another participant's environment.
 */
async function privilegedExtendEnvironment(environmentId) {
  const environment = await environmentsModel.findEnvironmentById(environmentId);
  if (!environment) {
    throw new ApplicationError("Environment not found.", 404);
  }
  return environmentsModel.extendEnvironmentExpiry(environmentId, ENVIRONMENT_EXTENSION_MS);
}

async function privilegedTerminateEnvironment(environmentId) {
  const environment = await environmentsModel.findEnvironmentById(environmentId);
  if (!environment) {
    throw new ApplicationError("Environment not found.", 404);
  }
  return environmentsModel.setEnvironmentStatus(environmentId, "TERMINATED");
}

module.exports = {
  getOrCreateEnvironmentForLab,
  resetEnvironment,
  terminateEnvironment,
  extendEnvironment,
  privilegedExtendEnvironment,
  privilegedTerminateEnvironment,
};
