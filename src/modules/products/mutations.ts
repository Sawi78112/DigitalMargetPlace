import type { NewProductSchema, UpdateProductSchema } from '.';
import { api, formData } from '$lib/api';
import type { Product } from '$lib/types';

export async function createProduct(data: NewProductSchema): Promise<Product> {
	const formDataPayload = formData.create(data);

	return api<Product>({
		method: 'POST',
		url: '/products',
		data: formDataPayload,
		isFormData: true
	});
}

export async function updateProduct(data: {
	id: string;
	product: UpdateProductSchema;
}): Promise<Product> {
	const { id, product } = data;
	return api<Product>({
		method: 'PUT',
		url: `/products/${id}`,
		data: product
	});
}

export async function deleteProduct(id: string): Promise<Product> {
	return api<Product>({
		method: 'DELETE',
		url: `/products/${id}`
	});
}
