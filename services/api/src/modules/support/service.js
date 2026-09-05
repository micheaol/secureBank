const supportModel = require("./model");
const { ApplicationError } = require("../../utils/apiResponse");

async function listMyTickets(userId) {
  return supportModel.findSupportTicketsByUserId(userId);
}

async function createTicket(userId, ticketDetails) {
  return supportModel.createSupportTicket({ userId, ...ticketDetails });
}

async function getMyTicketDetail(userId, ticketId) {
  const ticket = await supportModel.findSupportTicketByIdForUser(ticketId, userId);
  if (!ticket) {
    throw new ApplicationError("Support ticket not found.", 404);
  }
  return ticket;
}

async function addMessageToMyTicket(userId, ticketId, message) {
  await getMyTicketDetail(userId, ticketId);
  return supportModel.createSupportMessage({ ticketId, senderId: userId, message });
}

async function listAllTicketsForAgents(status) {
  return supportModel.findAllSupportTickets({ status });
}

async function getTicketForAgent(ticketId) {
  const ticket = await supportModel.findSupportTicketByIdForAgent(ticketId);
  if (!ticket) {
    throw new ApplicationError("Support ticket not found.", 404);
  }
  return ticket;
}

async function replyToTicketAsAgent(agentId, ticketId, message) {
  await getTicketForAgent(ticketId);
  await supportModel.updateSupportTicketStatus(ticketId, "PENDING");
  return supportModel.createSupportMessage({ ticketId, senderId: agentId, message });
}

async function updateTicketStatusAsAgent(ticketId, status) {
  await getTicketForAgent(ticketId);
  return supportModel.updateSupportTicketStatus(ticketId, status);
}

module.exports = {
  listMyTickets,
  createTicket,
  getMyTicketDetail,
  addMessageToMyTicket,
  listAllTicketsForAgents,
  getTicketForAgent,
  replyToTicketAsAgent,
  updateTicketStatusAsAgent,
};
