import { redirect } from '@sveltejs/kit';

import type { LayoutLoad } from './$types';
import { getUserMe } from '$modules/auth';

export const load: LayoutLoad = async () => {
	const user = await getUserMe();
	if (!user) redirect(303, '/login');
	return {
		user
	};
};
