const helpRequestsModel = require("./model");
const labsModel = require("../labs/model");

async function requestHelp(userId, labCode, reason) {
  const lab = labCode ? await labsModel.findLabByCode(labCode) : null;
  return helpRequestsModel.createHelpRequest({ userId, labId: lab?.id ?? null, reason });
}

async function listOpenHelpRequests() {
  const openRequests = await helpRequestsModel.findOpenHelpRequests();
  return openRequests.map((request) => ({
    id: request.id,
    requester: request.user.fullName,
    lab: request.lab?.name ?? "General",
    reason: request.reason,
    waitingSeconds: Math.round((Date.now() - request.createdAt.getTime()) / 1000),
  }));
}

async function resolveHelpRequest(id) {
  return helpRequestsModel.resolveHelpRequest(id);
}

module.exports = { requestHelp, listOpenHelpRequests, resolveHelpRequest };
