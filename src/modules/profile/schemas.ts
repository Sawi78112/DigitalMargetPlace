import type { Infer } from 'sveltekit-superforms';
import { z } from 'zod';

export const updatePasswordSchema = z.object({
	current_password: z
		.string()
		.optional()
		.refine((v) => !v || v.length >= 8, 'Minimum of 8 characters'),
	password: z
		.string()
		.optional()
		.refine((v) => !v || v.length >= 8, 'Minimum of 8 characters')
});

export type UpdatePasswordSchema = Infer<typeof updatePasswordSchema>;

export const newProfileSchema = z.object({
	first_name: z.string().min(1, 'First name is required'),
	middle_name: z.string().min(1, 'Middle name is required'),
	last_name: z.string().min(1, 'Last name is required'),
	birthdate: z
		.string()
		.min(1, 'Birthdate is required')
		.regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)'),
	gender: z.string().min(1, 'Gender is required'),
	user_id: z.string().uuid()
});

export type NewProfileSchema = Infer<typeof newProfileSchema>;

export const updateProfileSchema = newProfileSchema.extend({
	id: z.string().uuid({ message: 'Invalid profile ID' })
});

export type UpdateProfileSchema = Infer<typeof updateProfileSchema>;
