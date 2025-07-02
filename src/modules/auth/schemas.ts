import type { Infer } from 'sveltekit-superforms';
import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email('Type your email here'),
	password: z.string().min(1, { message: 'Type your password here' })
});

export type LoginSchema = Infer<typeof loginSchema>;

export const registerSchema = z
	.object({
		email: z.string().email('Type your email here'),
		password: z.string().min(8, 'Password must be at least 8 characters long'),
		confirmPassword: z.string().optional()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

export type RegisterSchema = Infer<typeof registerSchema>;

export const forgotPasswordRequestSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email' })
});

export type ForgotPasswordRequestSchema = Infer<typeof forgotPasswordRequestSchema>;

export const forgotPasswordSchema = z
	.object({
		code: z.string().min(6, {
			message: 'OTP Code must be at least 6 characters'
		}),

		password: z.string().min(8, 'Password must be at least 8 characters long'),
		confirmPassword: z.string()
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword']
	});

export type ForgotPasswordSchema = Infer<typeof forgotPasswordSchema>;

export const otpSchema = z.object({
	code: z.array(z.string().length(1)).length(6, { message: 'Must have 6 characters' })
});

export type OtpSchema = Infer<typeof otpSchema>;

export const emailConfirmationSchema = z.object({
	code: z.string().min(6, {
		message: 'Email Confirmation OTP must be at least 6 characters'
	})
});

export type EmailConfirmationSchema = Infer<typeof emailConfirmationSchema>;
