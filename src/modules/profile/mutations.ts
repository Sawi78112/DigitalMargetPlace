import type { UpdatePasswordSchema } from './schemas';
import { api } from '$lib/api';
import type { Password } from '$lib/types';

export async function updatePassword(data: { password: UpdatePasswordSchema }): Promise<Password> {
	const { password } = data;
	return api<Password>({
		method: 'PUT',
		url: `/security/password`,
		data: password
	});
}
