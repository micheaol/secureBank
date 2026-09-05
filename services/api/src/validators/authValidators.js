const { z } = require("zod");

const registerRequestSchema = z.object({
  fullName: z.string().trim().min(2, "Full name must be at least 2 characters long.").max(120),
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  phoneNumber: z.string().trim().min(7).max(20).optional(),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters long.")
    .regex(/[a-z]/, "Password must contain a lowercase letter.")
    .regex(/[A-Z]/, "Password must contain an uppercase letter.")
    .regex(/[0-9]/, "Password must contain a number."),
});

const loginRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

const forgotPasswordRequestSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
});

const resetPasswordRequestSchema = z.object({
  resetToken: z.string().min(1, "Reset token is required."),
  newPassword: z
    .string()
    .min(10, "Password must be at least 10 characters long.")
    .regex(/[a-z]/, "Password must contain a lowercase letter.")
    .regex(/[A-Z]/, "Password must contain an uppercase letter.")
    .regex(/[0-9]/, "Password must contain a number."),
});

module.exports = {
  registerRequestSchema,
  loginRequestSchema,
  forgotPasswordRequestSchema,
  resetPasswordRequestSchema,
};
