import type { AuthResults, LoginSchema, RegisterSchema } from '.';
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

export async function register(data: RegisterSchema): Promise<AuthResults> {
	try {
		const response = await api.post<AuthResults>('/register', {
			email: data.email,
			password: data.password
		});
		return response;
	} catch (error) {
		return Promise.reject(error);
	}
}
