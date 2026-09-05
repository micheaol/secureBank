const { z } = require("zod");

const initiateTransferRequestSchema = z
  .object({
    sourceAccountId: z.string().uuid("Choose a valid source account."),
    destinationAccountId: z.string().uuid().optional(),
    beneficiaryId: z.string().uuid().optional(),
    amount: z.coerce.number().positive("Enter an amount greater than zero."),
    description: z.string().trim().max(140).optional(),
  })
  .refine(
    (formValues) => Boolean(formValues.destinationAccountId) !== Boolean(formValues.beneficiaryId),
    { message: "Choose exactly one destination: an account or a beneficiary.", path: ["destinationAccountId"] }
  );

const confirmTransferRequestSchema = z.object({
  otpCode: z.string().regex(/^\d{6}$/, "Enter the 6-digit code."),
});

module.exports = {
  initiateTransferRequestSchema,
  confirmTransferRequestSchema,
};
