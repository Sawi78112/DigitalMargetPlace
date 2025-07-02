import { z } from 'zod';
import type { Infer } from 'sveltekit-superforms';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

export const newProductSchema = z.object({
	title: z.string().min(1, { message: 'Title is required' }),
	description: z.string().min(1, { message: 'Description is required' }),
	price: z.number().min(0, { message: 'Price must be non-negative' }),
	categories: z.array(z.string()).min(1, { message: 'At least one category is required' }),
	visibility: z.string().min(1, { message: 'Visibility is required' }),
	cover_photo: z
		.any()
		.refine((files) => files instanceof FileList && files.length > 0, 'Image is required')
		.refine(
			(files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
			`Max image size is 25MB.`
		)
		.refine(
			(files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
			'The file type you uploaded is not valid.'
		),
	product_photos: z
		.array(
			z
				.any()
				.refine((files) => files instanceof FileList && files.length > 0, 'Image is required')
				.refine(
					(files) => !files || files.length === 0 || files[0].size <= MAX_FILE_SIZE,
					`Max image size is 25MB.`
				)
				.refine(
					(files) => !files || files.length === 0 || ACCEPTED_IMAGE_TYPES.includes(files[0].type),
					'The file type you uploaded is not valid.'
				)
		)
		.min(1, { message: 'At least one photo is required' })
});

export const updateProductSchema = newProductSchema.extend({
	id: z.string().uuid({ message: 'Invalid product ID' })
});

export type NewProductSchema = Infer<typeof newProductSchema>;
export type UpdateProductSchema = Infer<typeof updateProductSchema>;
