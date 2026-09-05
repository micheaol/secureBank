import { z } from "zod";

const strongPasswordSchema = z
  .string()
  .min(10, "Password must be at least 10 characters long.")
  .regex(/[a-z]/, "Password must contain a lowercase letter.")
  .regex(/[A-Z]/, "Password must contain an uppercase letter.")
  .regex(/[0-9]/, "Password must contain a number.");

export const loginFormSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
  rememberMe: z.boolean().optional(),
});

export const registerFormSchema = z
  .object({
    fullName: z.string().trim().min(2, "Full name must be at least 2 characters long."),
    email: z.string().trim().toLowerCase().email("Enter a valid email address."),
    phoneNumber: z.string().trim().min(7, "Enter a valid phone number.").optional().or(z.literal("")),
    password: strongPasswordSchema,
    confirmPassword: z.string().min(1, "Confirm your password."),
  })
  .refine((formValues) => formValues.password === formValues.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const forgotPasswordFormSchema = z.object({
  email: z.string().trim().toLowerCase().email("Enter a valid email address."),
});

export const resetPasswordFormSchema = z
  .object({
    resetToken: z.string().min(1, "Paste the reset token from your email."),
    newPassword: strongPasswordSchema,
    confirmNewPassword: z.string().min(1, "Confirm your new password."),
  })
  .refine((formValues) => formValues.newPassword === formValues.confirmNewPassword, {
    message: "Passwords do not match.",
    path: ["confirmNewPassword"],
  });
