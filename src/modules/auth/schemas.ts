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
		password: z.string().min(8, 'Minimum of 8 characters'),
		confirm_password: z.string().min(8, 'Minimum of 8 characters').optional()
	})
	.refine((data) => data.password === data.confirm_password, {
		message: 'Passwords do not match',
		path: ['confirm_password']
	});

export type RegisterSchema = Infer<typeof registerSchema>;
