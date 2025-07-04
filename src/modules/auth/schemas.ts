import type { Infer } from 'sveltekit-superforms';
import { z } from 'zod';

export const loginSchema = z.object({
	email: z.string().email('Type your email here'),
	password: z.string().min(1, { message: 'Type your password here' })
});

export type LoginSchema = Infer<typeof loginSchema>;

export const registerSchema = z.object({
	full_name: z.string().min(3, 'Type your full name here'),
	username: z.string().min(1, 'Type your username here'),
	email: z.string().email('Please enter a valid email address'),
	password: z.string().min(8, 'Password must be at least 8 characters long')
});

export type RegisterSchema = Infer<typeof registerSchema>;

export const forgotPasswordRequestSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email' })
});

export type ForgotPasswordRequestSchema = Infer<typeof forgotPasswordRequestSchema>;

export const forgotPasswordSchema = z
	.object({
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
	code: z.string().length(6, {
		message: 'Email Confirmation OTP must be at least 6 characters'
	})
});

export type EmailConfirmationSchema = Infer<typeof emailConfirmationSchema>;
