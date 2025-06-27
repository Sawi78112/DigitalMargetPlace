import { z } from 'zod';
import type { Infer } from 'sveltekit-superforms';

export const newProductSchema = z.object({
	title: z.string().min(1, 'required'),
	description: z.string().min(1, 'required'),
	price: z.number().min(0, 'price must be non-negative'),
	categories: z.array(z.string()).min(1, 'at least one category is required'),
	visibility: z.string().min(1, 'required')
});

export const updateProductSchema = newProductSchema.extend({
	id: z.string().uuid({ message: 'Invalid product ID' })
});

export type NewProductSchema = Infer<typeof newProductSchema>;
export type UpdateProductSchema = Infer<typeof updateProductSchema>;
