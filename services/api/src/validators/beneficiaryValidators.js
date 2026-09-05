const { z } = require("zod");

const createBeneficiaryRequestSchema = z.object({
  nickname: z.string().trim().max(60).optional(),
  accountName: z.string().trim().min(2, "Enter the account holder's name."),
  accountNumber: z.string().trim().regex(/^\d{10}$/, "Enter a valid 10-digit account number."),
  bankName: z.string().trim().min(2, "Enter the bank name."),
});

module.exports = { createBeneficiaryRequestSchema };
