import type { NewProfileSchema, UpdatePasswordSchema, UpdateProfileSchema } from './schemas';
import { api } from '$lib/api';
import type { Password, Profile } from '$lib/types';

export async function updatePassword(data: { password: UpdatePasswordSchema }): Promise<Password> {
	const { password } = data;
	return api<Password>({
		method: 'PUT',
		url: `/security`,
		data: password
	});
}
