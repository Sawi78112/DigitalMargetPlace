import { z } from 'zod';
import type { Infer } from 'sveltekit-superforms';

export const newProductSchema = z.object({
	title: z.string().min(1, { message: 'Title is required' }),
	description: z.string().min(1, { message: 'Description is required' }),
	price: z.number().min(0, { message: 'Price must be non-negative' }),
	categories: z.array(z.string()).min(1, { message: 'At least one category is required' }),
	visibility: z.string().min(1, { message: 'Visibility is required' }),
	cover_photo: z
		.object({
			image_url: z.string().min(1, { message: 'Image URL is required' })
		})
		.optional(),
	product_photos: z
		.array(
			z.object({
				image_url: z.string().min(1, { message: 'Image URL is required' })
			})
		)
		.max(10, { message: 'You can add up to 10 product photos' })
		.optional()
		.default([])
});

export const updateProductSchema = newProductSchema.extend({
	id: z.string().uuid({ message: 'Invalid product ID' })
});

export type NewProductSchema = Infer<typeof newProductSchema>;
export type UpdateProductSchema = Infer<typeof updateProductSchema>;
