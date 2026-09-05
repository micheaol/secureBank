const { z } = require("zod");

const createTicketRequestSchema = z.object({
  subject: z.string().trim().min(4, "Give your case a short subject."),
  category: z.string().trim().min(2, "Choose a category."),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
});

const createMessageRequestSchema = z.object({
  message: z.string().trim().min(1, "Enter a message."),
});

const updateTicketStatusRequestSchema = z.object({
  status: z.enum(["OPEN", "PENDING", "RESOLVED", "CLOSED"]),
});

module.exports = {
  createTicketRequestSchema,
  createMessageRequestSchema,
  updateTicketStatusRequestSchema,
};
