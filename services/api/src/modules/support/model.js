const prismaClient = require("../../config/prismaClient");

const messageIncludeWithSender = {
  messages: {
    orderBy: { createdAt: "asc" },
    include: { sender: { select: { id: true, fullName: true, roleId: true } } },
  },
};

async function createSupportTicket({ userId, subject, category, priority }) {
  return prismaClient.supportTicket.create({
    data: { userId, subject, category, priority },
  });
}

async function findSupportTicketsByUserId(userId) {
  return prismaClient.supportTicket.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: messageIncludeWithSender,
  });
}

async function findSupportTicketByIdForUser(ticketId, userId) {
  return prismaClient.supportTicket.findFirst({
    where: { id: ticketId, userId },
    include: messageIncludeWithSender,
  });
}

async function findAllSupportTickets({ status } = {}) {
  return prismaClient.supportTicket.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, fullName: true, email: true } },
      ...messageIncludeWithSender,
    },
  });
}

async function findSupportTicketByIdForAgent(ticketId) {
  return prismaClient.supportTicket.findUnique({
    where: { id: ticketId },
    include: {
      user: { select: { id: true, fullName: true, email: true } },
      ...messageIncludeWithSender,
    },
  });
}

async function updateSupportTicketStatus(ticketId, status) {
  return prismaClient.supportTicket.update({ where: { id: ticketId }, data: { status } });
}

async function createSupportMessage({ ticketId, senderId, message }) {
  return prismaClient.supportMessage.create({
    data: { ticketId, senderId, message },
    include: { sender: { select: { id: true, fullName: true, roleId: true } } },
  });
}

module.exports = {
  createSupportTicket,
  findSupportTicketsByUserId,
  findSupportTicketByIdForUser,
  findAllSupportTickets,
  findSupportTicketByIdForAgent,
  updateSupportTicketStatus,
  createSupportMessage,
};
