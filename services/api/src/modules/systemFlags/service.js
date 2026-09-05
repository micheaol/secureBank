const systemFlagsModel = require("./model");
const auditService = require("../audit/service");

const PROVISIONING_STOPPED_KEY = "provisioning_stopped";
const EMERGENCY_SHUTDOWN_KEY = "emergency_shutdown";

function labDisabledKey(labCode) {
  return `lab_disabled:${labCode}`;
}

async function isFlagSet(key) {
  const flag = await systemFlagsModel.getFlag(key);
  return Boolean(flag?.value);
}

async function isProvisioningStopped() {
  return isFlagSet(PROVISIONING_STOPPED_KEY);
}

async function isLabDisabled(labCode) {
  return isFlagSet(labDisabledKey(labCode));
}

async function isEmergencyShutdownActive() {
  return isFlagSet(EMERGENCY_SHUTDOWN_KEY);
}

async function setEmergencyFlag(key, value, reason, actorId, actorRoleName) {
  const flag = await systemFlagsModel.setFlag(key, value, reason, actorId);

  await auditService.recordAuditEvent(null, {
    action: "emergency.flag_changed",
    result: "SUCCESS",
    actorId,
    actorRole: actorRoleName,
    resourceType: "SystemFlag",
    resourceId: key,
    metadata: { value, reason },
  });

  return flag;
}

async function listAllFlags() {
  return systemFlagsModel.listFlags();
}

module.exports = {
  PROVISIONING_STOPPED_KEY,
  EMERGENCY_SHUTDOWN_KEY,
  labDisabledKey,
  isProvisioningStopped,
  isLabDisabled,
  isEmergencyShutdownActive,
  setEmergencyFlag,
  listAllFlags,
};
