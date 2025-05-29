import { z } from 'zod';
import type { Infer } from 'sveltekit-superforms';

export const newProductSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	description: z.string().min(1, 'Description is required'),
	categories: z.array(z.string()).min(1)
});

export const updateProductSchema = newProductSchema.extend({
	id: z.string().uuid({ message: 'Invalid product ID' })
});

export type NewProductSchema = Infer<typeof newProductSchema>;
export type UpdateProductSchema = Infer<typeof updateProductSchema>;
