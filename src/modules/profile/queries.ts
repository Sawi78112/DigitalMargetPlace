import type { Profile } from '$lib/types';
import { api } from '$lib/api';

export async function getProfileByUserId(userId: string): Promise<Profile> {
	return await api<Profile>({
		method: 'GET',
		url: `/profile/${userId}`
	});
}
