import { redirect } from '@sveltejs/kit';

import type { PageLoad } from './$types';
import { getUser } from '$modules/auth';

export const load: PageLoad = async () => {
	const user = await getUser();
	if (user) {
		redirect(303, '/home');
	}

	return {};
};
