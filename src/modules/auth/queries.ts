import { api } from '$lib/api';
import type { User } from '$lib/types';

export async function getUserMe() {
	return await api<User>({
		url: '/users/me',
		method: 'GET'
	});
}
