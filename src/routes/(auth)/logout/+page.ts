import { redirect } from '@sveltejs/kit';

import type { PageLoad } from './$types';
import { removeAuthToken } from '$lib/api';

export const load: PageLoad = async () => {
	removeAuthToken();
	redirect(303, '/login');
};
