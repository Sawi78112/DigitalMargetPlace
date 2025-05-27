import type { Categories, Product } from '$lib/types';
import { api } from '$lib/api';

export async function getCategories(): Promise<Categories[]> {
	return await api<Categories[]>({
		method: 'GET',
		url: '/categories'
	});
}
