import type { NewProductSchema, UpdateProductSchema } from '.';
import { api } from '$lib/api';
import type { Product } from '$lib/types';

export async function createProduct(data: NewProductSchema): Promise<Product> {
	return api<Product>({
		method: 'POST',
		url: '/products',
		data
	});
}

export async function updateProduct(data: UpdateProductSchema): Promise<Product> {
	return api<Product>({
		method: 'PUT',
		url: `/products/${data.id}`,
		data
	});
}

export async function deleteProduct(id: string): Promise<Product> {
	return api<Product>({
		method: 'DELETE',
		url: `/products/${id}`
	});
}
