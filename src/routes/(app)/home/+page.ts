import { redirect } from '@sveltejs/kit';

import type { PageLoad } from './$types';
import { getUserMe } from '$modules/auth';

export const load: PageLoad = async () => {
	const user = await getUserMe();
	if (!user) redirect(303, '/login');

	return {};
};
