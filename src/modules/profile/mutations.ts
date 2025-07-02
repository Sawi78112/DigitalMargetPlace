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

export async function createProfile(data: NewProfileSchema): Promise<Profile> {
	return api<Profile>({
		method: 'POST',
		url: '/profile',
		data
	});
}

export async function updateProfile(data: UpdateProfileSchema): Promise<Profile> {
	return api<Profile>({
		method: 'PUT',
		url: '/profile',
		data
	});
}
