import { api } from '$lib/api';
import type { User } from '$lib/types';

export async function getUser(): Promise<User | null> {
	try {
		return await api.get<User>('/users/me');
		// eslint-disable-next-line unused-imports/no-unused-vars
	} catch (err) {
		return null;
	}
}
