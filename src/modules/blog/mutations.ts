import type { NewBlogSchema } from '.';
import { api, formData } from '$lib/api';
import type { Blog } from '$lib/types';

export async function createBlog(data: NewBlogSchema): Promise<Blog> {
	const formDataPayload = formData.create(data);

	return api<Blog>({
		method: 'POST',
		url: '/blog',
		data: formDataPayload,
		isFormData: true
	});
}
