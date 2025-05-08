import { redirect } from '@sveltejs/kit';

import type { LayoutLoad } from './$types';
import { getUser } from '$modules/auth';

export const load: LayoutLoad = async () => {
	const user = await getUser();
	if (!user) redirect(303, '/login');
	return {
		user
	};
};
