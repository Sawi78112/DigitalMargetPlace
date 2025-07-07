import { z } from 'zod';
import type { Infer } from 'sveltekit-superforms';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export const newProductSchema = z.object({
	title: z.string().min(1, { message: 'Title is required' }),
	description: z.string().min(1, { message: 'Description is required' }),
	price: z.number().min(0, { message: 'Price must be non-negative' }),
	categories: z.array(z.string()).min(1, { message: 'At least one category is required' }),
	visibility: z.string().min(1, { message: 'Visibility is required' }),
	cover_photo: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < MAX_FILE_SIZE, 'Max 5MB upload size.'),
	product_photos: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < MAX_FILE_SIZE, 'Max 25MB upload size.')
		.array()
});

export const updateProductSchema = newProductSchema.extend({
	id: z.string().uuid({ message: 'Invalid product ID' })
});

export type NewProductSchema = Infer<typeof newProductSchema>;
export type UpdateProductSchema = Infer<typeof updateProductSchema>;
