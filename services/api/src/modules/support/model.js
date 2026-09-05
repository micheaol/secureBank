const prismaClient = require("../../config/prismaClient");

// Full support ticketing (create/view/messaging/support-agent interface) is a
// Week 2 deliverable (SB-011). This module currently exposes only the
// data-access functions the data model requires.

async function createSupportTicket({ userId, subject, category, priority }) {
  return prismaClient.supportTicket.create({
    data: { userId, subject, category, priority },
  });
}

async function findSupportTicketsByUserId(userId) {
  return prismaClient.supportTicket.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { messages: true },
  });
}

async function createSupportMessage({ ticketId, senderId, message }) {
  return prismaClient.supportMessage.create({
    data: { ticketId, senderId, message },
  });
}

module.exports = {
  createSupportTicket,
  findSupportTicketsByUserId,
  createSupportMessage,
};
