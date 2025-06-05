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
