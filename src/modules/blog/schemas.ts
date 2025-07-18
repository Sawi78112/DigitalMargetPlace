import { z } from 'zod';
import type { Infer } from 'sveltekit-superforms';

const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB

export const newBlogSchema = z.object({
	title: z.string().min(1, { message: 'Title is required' }),
	content: z.string().min(1, { message: 'Description is required' }),
	visibility: z.string().min(1, { message: 'Visibility is required' }),
	image_url: z
		.instanceof(File, { message: 'Please upload a file.' })
		.refine((f) => f.size < MAX_FILE_SIZE, 'Max 5MB upload size.')
});

export type NewBlogSchema = Infer<typeof newBlogSchema>;
