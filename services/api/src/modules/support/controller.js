const supportService = require("./service");
const { sendSuccessResponse } = require("../../utils/apiResponse");

async function listMyTicketsHandler(request, response) {
  const tickets = await supportService.listMyTickets(request.authenticatedUser.userId);
  return sendSuccessResponse(response, { message: "Support tickets retrieved successfully.", data: { tickets } });
}

async function createTicketHandler(request, response) {
  const ticket = await supportService.createTicket(request.authenticatedUser.userId, request.validatedBody);
  return sendSuccessResponse(response, { statusCode: 201, message: "Support ticket created.", data: { ticket } });
}

async function getMyTicketByIdHandler(request, response) {
  const ticket = await supportService.getMyTicketDetail(request.authenticatedUser.userId, request.params.ticketId);
  return sendSuccessResponse(response, { message: "Support ticket retrieved successfully.", data: { ticket } });
}

async function addMessageToMyTicketHandler(request, response) {
  const message = await supportService.addMessageToMyTicket(
    request.authenticatedUser.userId,
    request.params.ticketId,
    request.validatedBody.message
  );
  return sendSuccessResponse(response, { statusCode: 201, message: "Message sent.", data: { message } });
}

async function listAllTicketsForAgentsHandler(request, response) {
  const tickets = await supportService.listAllTicketsForAgents(request.query.status);
  return sendSuccessResponse(response, { message: "Support tickets retrieved successfully.", data: { tickets } });
}

async function getTicketForAgentHandler(request, response) {
  const ticket = await supportService.getTicketForAgent(request.params.ticketId);
  return sendSuccessResponse(response, { message: "Support ticket retrieved successfully.", data: { ticket } });
}

async function replyToTicketAsAgentHandler(request, response) {
  const message = await supportService.replyToTicketAsAgent(
    request.authenticatedUser.userId,
    request.params.ticketId,
    request.validatedBody.message
  );
  return sendSuccessResponse(response, { statusCode: 201, message: "Reply sent.", data: { message } });
}

async function updateTicketStatusHandler(request, response) {
  const ticket = await supportService.updateTicketStatusAsAgent(request.params.ticketId, request.validatedBody.status);
  return sendSuccessResponse(response, { message: "Ticket status updated.", data: { ticket } });
}

module.exports = {
  listMyTicketsHandler,
  createTicketHandler,
  getMyTicketByIdHandler,
  addMessageToMyTicketHandler,
  listAllTicketsForAgentsHandler,
  getTicketForAgentHandler,
  replyToTicketAsAgentHandler,
  updateTicketStatusHandler,
};
