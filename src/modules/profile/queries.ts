import type { Profile } from '$lib/types';
import { api } from '$lib/api';

export async function getProfileByUserId(): Promise<Profile> {
	return await api<Profile>({
		method: 'GET',
		url: `/profile`
	});
}
