import type { AuthResults, LoginSchema } from '.';
import { api } from '$lib/api';

export async function login(data: LoginSchema): Promise<AuthResults> {
	try {
		return await api.post('/login', {
			email: data.email,
			password: data.password
		});
	} catch (error) {
		return Promise.reject(error);
	}
}
