const { z } = require("zod");

const emergencyReasonRequestSchema = z.object({
  reason: z.string().trim().min(10, "A written reason of at least 10 characters is required for this action."),
});

module.exports = { emergencyReasonRequestSchema };
