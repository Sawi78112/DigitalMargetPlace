import { redirect } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { auth } from '$lib/api';

export const load: PageLoad = async () => {
	auth.clearToken();
	redirect(303, '/login');
};
