import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, { message: "Password is required" }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  // Optional metadata that can be stored in user_metadata
  full_name: z.string().min(1, "Full name is required").optional(),
  username: z.string().min(1, "Username is required").optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

export const forgotPasswordRequestSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

export type ForgotPasswordRequestSchema = z.infer<
  typeof forgotPasswordRequestSchema
>;

export const forgotPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ForgotPasswordSchema = z.infer<typeof forgotPasswordSchema>;

// For email confirmation via OTP code
export const emailConfirmationSchema = z.object({
  code: z.string().length(6, "Confirmation code must be 6 digits"),
});

export type EmailConfirmationSchema = z.infer<typeof emailConfirmationSchema>;
