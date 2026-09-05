const { z } = require("zod");

const submitAnswerRequestSchema = z.object({
  answer: z.string().trim().min(1, "Choose an answer before submitting."),
  evidence: z.array(z.object({ source: z.string(), text: z.string() })).optional(),
});

module.exports = { submitAnswerRequestSchema };
